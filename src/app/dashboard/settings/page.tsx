import { SettingsForm } from "@/components/dashboard/settings-form";
import { requireVendor } from "@/lib/auth/session";
export default async function SettingsPage(){const{vendor}=await requireVendor();return <div className="mx-auto max-w-3xl space-y-7"><div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="mt-2 text-slate-500">Keep your business and fulfillment details current.</p></div><SettingsForm vendor={vendor}/></div>}
