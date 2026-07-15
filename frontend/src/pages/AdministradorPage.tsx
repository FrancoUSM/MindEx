import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Building2, CreditCard, FlaskConical, LogIn, ShieldCheck, Trash2, Pencil, Plus, X } from "lucide-react";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

interface TestItem {
  id_test: number;
  nombre_test: string;
  descripcion: string;
}

interface PlanItem {
  id_plan: number;
  nombre_plan: string;
  descripcion_plan: string;
  tipo_plan: string;
  precio_por_usuario: number;
  duracion_meses: number;
}

interface SubscriptionItem {
  id_suscripcion: number;
  fecha_inicio: string;
  fecha_fin: string;
  plan?: PlanItem;
  empresa?: { id_empresa: number; razonSocial?: string; nombre_comercial?: string };
}

interface CompanyItem {
  id_empresa: number;
  razonSocial: string;
  nombre_comercial: string;
  correo: string;
  telefono: string;
}

interface ServiceItem {
  id_servicio?: number;
  nombreServicio?: string;
  nombre_servicio?: string;
  descripcion?: string;
  tipo_servicio?: string;
}

const emptyTestForm = { id_servicio: "", nombre_test: "", descripcion: "", questions: [] as { text: string; order: number }[] };
const emptySubscriptionForm = { id_empresa: "", id_plan: "", fecha_inicio: "", fecha_fin: "" };
const emptyServiceForm = { nombre_servicio: "", descripcion_servicio: "", tipo_servicio: "" };

export default function AdministradorPage() {
  const navigate = useNavigate();
  const session = useMemo(() => getSession(), []);

  // Role-based protection: Only ADMIN role can access this page
  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    if (session.rol !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [session, navigate]);

  // If not authorized, don't render anything
  if (!session || session.rol !== "ADMIN") {
    return null;
  }
  

  const [activeSection, setActiveSection] = useState("tests");
  const [tests, setTests] = useState<TestItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [testForm, setTestForm] = useState(emptyTestForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [subscriptionForm, setSubscriptionForm] = useState(emptySubscriptionForm);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const [testsRes, servicesRes, subscriptionsRes, companiesRes, plansRes] = await Promise.all([
        authFetch(`${import.meta.env.VITE_API_URL}/api/test`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/servicio`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/suscripcion`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/empresa`),
        authFetch(`${import.meta.env.VITE_API_URL}/api/plan`),
      ]);

      if (testsRes.ok) {
        try {
          const testsData = await testsRes.json();
          setTests(Array.isArray(testsData) ? testsData : []);
        } catch {
          setTests([]);
        }
      }

      if (servicesRes.ok) {
        try {
          const servicesData = await servicesRes.json();
          setServices(Array.isArray(servicesData) ? servicesData : []);
        } catch {
          setServices([]);
        }
      }

      if (subscriptionsRes.ok) {
        setSubscriptions(await subscriptionsRes.json());
      }

      if (companiesRes.ok) {
        setCompanies(await companiesRes.json());
      }

      if (plansRes.ok) {
        setPlans(await plansRes.json());
      }
    } catch (e: any) {
      setError(e.message ?? "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createTest = async (event: FormEvent) => {
    event.preventDefault();
    if (!testForm.nombre_test || !testForm.descripcion) {
      setError("Completa nombre y descripción del test");
      setSuccess(null);
      return;
    }

    if (testForm.questions.length === 0) {
      setError("Agrega al menos una pregunta al test");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Convert questions array to Map format expected by backend
      const preguntas: { [key: string]: number } = {};
      testForm.questions.forEach((q) => {
        preguntas[q.text] = q.order;
      });

      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/test/crear`, {
        method: "POST",
        body: JSON.stringify({
          id_servicio: Number(testForm.id_servicio),
          nombre_test: testForm.nombre_test,
          descripcion: testForm.descripcion,
          preguntas,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el test");
      }

      setSuccess("Test creado exitosamente");
      setTestForm(emptyTestForm);
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear el test");
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    setTestForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { text: "", order: prev.questions.length + 1 }],
    }));
  };

  const removeQuestion = (index: number) => {
    setTestForm((prev) => {
      const updated = prev.questions.filter((_, i) => i !== index);
      // Reorder remaining questions
      updated.forEach((q, i) => {
        q.order = i + 1;
      });
      return { ...prev, questions: updated };
    });
  };

  const updateQuestion = (index: number, text: string) => {
    setTestForm((prev) => {
      const updated = [...prev.questions];
      updated[index].text = text;
      return { ...prev, questions: updated };
    });
  };

  const saveService = async (event: FormEvent) => {
    event.preventDefault();
    if (!serviceForm.nombre_servicio || !serviceForm.tipo_servicio) {
      setError("Completa al menos nombre y tipo del servicio");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = editingServiceId
        ? `${import.meta.env.VITE_API_URL}/api/servicio/actualizar/${editingServiceId}`
        : `${import.meta.env.VITE_API_URL}/api/servicio/crear-servicio`;
      const response = await authFetch(endpoint, {
        method: editingServiceId ? "PUT" : "POST",
        body: JSON.stringify({
          nombre_servicio: serviceForm.nombre_servicio,
          descripcion_servicio: serviceForm.descripcion_servicio,
          tipo_servicio: serviceForm.tipo_servicio,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el servicio");
      }

      setSuccess(editingServiceId ? "Servicio actualizado exitosamente" : "Servicio creado exitosamente");
      setServiceForm(emptyServiceForm);
      setEditingServiceId(null);
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "No se pudo guardar el servicio");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar este servicio?")) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/servicio/eliminar/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("No se pudo eliminar el servicio");
      }
      setSuccess("Servicio eliminado exitosamente");
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "No se pudo eliminar el servicio");
    }
  };

  const startEditService = (item: ServiceItem) => {
    setEditingServiceId(item.id_servicio);
    setServiceForm({
      nombre_servicio: item.nombreServicio || item.nombre_servicio || "",
      descripcion_servicio: item.descripcion || "",
      tipo_servicio: item.tipo_servicio || "",
    });
    setActiveSection("services");
  };

  const saveSubscription = async (event: FormEvent) => {
    event.preventDefault();
    if (!subscriptionForm.id_empresa || !subscriptionForm.id_plan || !subscriptionForm.fecha_inicio || !subscriptionForm.fecha_fin) {
      setError("Completa todos los campos de la suscripción");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const endpoint = editingSubscriptionId
        ? `${import.meta.env.VITE_API_URL}/api/suscripcion/actualizar/${editingSubscriptionId}`
        : `${import.meta.env.VITE_API_URL}/api/suscripcion/crear`;
      const response = await authFetch(endpoint, {
        method: editingSubscriptionId ? "PUT" : "POST",
        body: JSON.stringify({
          id_empresa: Number(subscriptionForm.id_empresa),
          id_plan: Number(subscriptionForm.id_plan),
          fecha_inicio: subscriptionForm.fecha_inicio,
          fecha_fin: subscriptionForm.fecha_fin,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la suscripción");
      }

      setSuccess(editingSubscriptionId ? "Suscripción actualizada exitosamente" : "Suscripción creada exitosamente");
      setSubscriptionForm(emptySubscriptionForm);
      setEditingSubscriptionId(null);
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "No se pudo guardar la suscripción");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSubscription = async (id: number) => {
    if (!window.confirm("¿Deseas desactivar esta suscripción?")) return;

    setError(null);
    setSuccess(null);
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/suscripcion/eliminar/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("No se pudo eliminar la suscripción");
      }
      setSuccess("Suscripción desactivada exitosamente");
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "No se pudo eliminar la suscripción");
    }
  };

  const startEditSubscription = (item: SubscriptionItem) => {
    setEditingSubscriptionId(item.id_suscripcion);
    setSubscriptionForm({
      id_empresa: item.empresa?.id_empresa?.toString() ?? "",
      id_plan: item.plan?.id_plan?.toString() ?? "",
      fecha_inicio: item.fecha_inicio ?? "",
      fecha_fin: item.fecha_fin ?? "",
    });
    setActiveSection("subscriptions");
  };

  const summary = useMemo(() => (({
    tests: tests.length,
    services: services.length,
    subscriptions: subscriptions.length,
    companies: companies.length,
  })), [tests.length, services.length, subscriptions.length, companies.length]);

  if (!session) {
    return (
      <div className="container mx-auto py-16 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500" />
        <p className="mt-3">Debes iniciar sesión</p>
        <Button className="mt-4" onClick={() => navigate("/auth")}>
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel de Administrador</h1>
                <p className="text-sm text-slate-500">Gestiona tests psicológicos, suscripciones y empresas desde un solo lugar.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                Sesión activa para {session.nombre}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.tests}</div>
                <div className="text-sm text-slate-500">Tests psicológicos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{summary.services}</div>
                <div className="text-sm text-slate-500">Servicios</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-emerald-600">{summary.subscriptions}</div>
                <div className="text-sm text-slate-500">Suscripciones activas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-violet-600">{summary.companies}</div>
                <div className="text-sm text-slate-500">Empresas registradas</div>
              </CardContent>
            </Card>
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
          {success ? <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div> : null}

          {activeSection === "tests" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5" /> Crear test psicológico</CardTitle>
                <CardDescription>Registra una nueva evaluación psicológica con sus preguntas.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createTest} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id_servicio">Servicio</Label>
                      <Select value={testForm.id_servicio} onValueChange={(value) => setTestForm({ ...testForm, id_servicio: value })}>
                        <SelectTrigger id="id_servicio">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id_servicio} value={service.id_servicio?.toString() || ""}>
                              {service.nombreServicio || service.nombre_servicio || `Servicio ${service.id_servicio}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nombre_test">Nombre del test</Label>
                      <Input id="nombre_test" value={testForm.nombre_test} onChange={(e) => setTestForm({ ...testForm, nombre_test: e.target.value })} placeholder="Ej. PHQ-9 (Depresión)" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion_test">Descripción</Label>
                    <Textarea id="descripcion_test" value={testForm.descripcion} onChange={(e) => setTestForm({ ...testForm, descripcion: e.target.value })} placeholder="Describe el propósito del test psicológico" />
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Preguntas del test</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                        <Plus className="h-4 w-4 mr-2" /> Agregar pregunta
                      </Button>
                    </div>

                    {testForm.questions.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">Agrega preguntas haciendo clic en "Agregar pregunta"</p>
                    ) : (
                      <div className="space-y-2">
                        {testForm.questions.map((question, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <div className="flex-1 space-y-1">
                              <Label htmlFor={`question-${index}`} className="text-sm">Pregunta {index + 1}</Label>
                              <Input
                                id={`question-${index}`}
                                value={question.text}
                                onChange={(e) => updateQuestion(index, e.target.value)}
                                placeholder="Ingresa la pregunta del test"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Creando test..." : "Crear test psicológico"}
                  </Button>
                </form>

                <div className="mt-6 border-t pt-6 space-y-2">
                  <h3 className="font-semibold text-slate-800">Tests creados recientemente</h3>
                  {tests.length === 0 ? <p className="text-sm text-slate-500">Aún no hay tests creados.</p> : (
                    <div className="space-y-2">
                      {tests.map((test) => (
                        <div key={test.id_test} className="rounded-xl border p-3 bg-slate-50">
                          <p className="font-medium text-slate-900">{test.nombre_test}</p>
                          <p className="text-sm text-slate-500">{test.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {activeSection === "subscriptions" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Suscripciones</CardTitle>
                <CardDescription>Agrega, actualiza o elimina suscripciones para las empresas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={saveSubscription} className="space-y-4 rounded-xl border p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id_empresa">Empresa</Label>
                      <Select value={subscriptionForm.id_empresa} onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, id_empresa: value })}>
                        <SelectTrigger id="id_empresa">
                          <SelectValue placeholder="Selecciona una empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id_empresa} value={company.id_empresa.toString()}>
                              {company.nombre_comercial || company.razonSocial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id_plan">Plan</Label>
                      <Select value={subscriptionForm.id_plan} onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, id_plan: value })}>
                        <SelectTrigger id="id_plan">
                          <SelectValue placeholder="Selecciona un plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id_plan} value={plan.id_plan.toString()}>
                              {plan.nombre_plan} - ${plan.precio_por_usuario}/usuario
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                      <Input id="fecha_inicio" type="date" value={subscriptionForm.fecha_inicio} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, fecha_inicio: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha_fin">Fecha de fin</Label>
                      <Input id="fecha_fin" type="date" value={subscriptionForm.fecha_fin} onChange={(e) => setSubscriptionForm({ ...subscriptionForm, fecha_fin: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : editingSubscriptionId ? "Actualizar suscripción" : "Crear suscripción"}</Button>
                </form>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Suscripciones registradas</h3>
                  {loading ? <p className="text-sm text-slate-500">Cargando...</p> : subscriptions.length === 0 ? <p className="text-sm text-slate-500">No hay suscripciones aún.</p> : (
                    <div className="space-y-2">
                      {subscriptions.map((item) => (
                        <div key={item.id_suscripcion} className="flex flex-col gap-2 rounded-xl border p-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium">{item.empresa?.razonSocial || item.empresa?.nombre_comercial || `Empresa ${item.empresa?.id_empresa ?? "-"}`}</p>
                            <p className="text-sm text-slate-500">{item.plan?.nombre_plan || "Plan sin nombre"} · {item.fecha_inicio} a {item.fecha_fin}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditSubscription(item)}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteSubscription(item.id_suscripcion)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {activeSection === "services" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Servicios</CardTitle>
                <CardDescription>Crea, edita o elimina servicios psicológicos disponibles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={saveService} className="space-y-4 rounded-xl border p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre_servicio">Nombre del servicio</Label>
                      <Input id="nombre_servicio" value={serviceForm.nombre_servicio} onChange={(e) => setServiceForm({ ...serviceForm, nombre_servicio: e.target.value })} placeholder="Ej. Evaluación Psicológica" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo_servicio">Tipo de servicio</Label>
                      <Input id="tipo_servicio" value={serviceForm.tipo_servicio} onChange={(e) => setServiceForm({ ...serviceForm, tipo_servicio: e.target.value })} placeholder="Ej. Psicología Clínica" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion_servicio">Descripción</Label>
                    <Textarea id="descripcion_servicio" value={serviceForm.descripcion_servicio} onChange={(e) => setServiceForm({ ...serviceForm, descripcion_servicio: e.target.value })} placeholder="Describe el servicio" />
                  </div>
                  <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : editingServiceId ? "Actualizar servicio" : "Crear servicio"}</Button>
                </form>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Servicios registrados</h3>
                  {loading ? <p className="text-sm text-slate-500">Cargando...</p> : services.length === 0 ? <p className="text-sm text-slate-500">No hay servicios registrados.</p> : (
                    <div className="space-y-2">
                      {services.map((item) => (
                        <div key={item.id_servicio} className="flex flex-col gap-2 rounded-xl border p-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium">{item.nombreServicio || item.nombre_servicio}</p>
                            <p className="text-sm text-slate-500">{item.tipo_servicio}</p>
                            {item.descripcion && <p className="text-xs text-slate-400 mt-1">{item.descripcion}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditService(item)}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteService(item.id_servicio!)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {activeSection === "companies" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Empresas</CardTitle>
                <CardDescription>Consulta las empresas registradas en la plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-slate-500">Cargando...</p> : companies.length === 0 ? <p className="text-sm text-slate-500">No hay empresas registradas.</p> : (
                  <div className="space-y-2">
                    {companies.map((company) => (
                      <div key={company.id_empresa} className="rounded-xl border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">{company.razonSocial}</p>
                            <p className="text-sm text-slate-500">{company.nombre_comercial}</p>
                          </div>
                          <Badge variant="secondary">{company.correo}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Teléfono: {company.telefono}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

