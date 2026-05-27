"use client";

import { useState } from "react";
import type { SubmissionLog, EmailLog } from "@/lib/logs";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

type LogsViewerProps = {
  submissions: SubmissionLog[];
  emails: EmailLog[];
};

export function LogsViewer({ submissions, emails }: LogsViewerProps) {
  const [activeTab, setActiveTab] = useState<"submissions" | "emails">("submissions");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-[#2a3c44] pb-4">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`text-sm font-semibold transition-colors ${
            activeTab === "submissions"
              ? "text-[#d8c7a3] border-b-2 border-[#276864] pb-[17px] -mb-[18px]"
              : "text-[#8da0aa] hover:text-white"
          }`}
        >
          Formulare Contact
        </button>
        <button
          onClick={() => setActiveTab("emails")}
          className={`text-sm font-semibold transition-colors ${
            activeTab === "emails"
              ? "text-[#d8c7a3] border-b-2 border-[#276864] pb-[17px] -mb-[18px]"
              : "text-[#8da0aa] hover:text-white"
          }`}
        >
          Loguri Email-uri
        </button>
      </div>

      <div className="overflow-x-auto rounded-[1.8rem] border border-[#2a3c44] bg-[#10181d] p-6 sm:p-8">
        {activeTab === "submissions" && (
          <div className="space-y-6">
            {submissions.length === 0 ? (
              <p className="text-sm text-[#8da0aa]">Niciun formular trimis încă.</p>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="rounded-2xl border border-[#25373f] bg-[#0f171c] p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1c2c33] pb-4">
                    <div>
                      <h3 className="font-semibold text-white">{sub.data.name}</h3>
                      <p className="text-sm text-[#d8c7a3]">{sub.data.email} • {sub.data.phone}</p>
                    </div>
                    <div className="text-right text-xs text-[#8da0aa]">
                      <p>{format(new Date(sub.timestamp), "dd MMM yyyy, HH:mm:ss", { locale: ro })}</p>
                      <p>IP: {sub.meta.ip}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#455a64]">Serviciu</p>
                    <p className="text-sm text-[#dce2e6]">{sub.data.service}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#455a64]">Mesaj</p>
                    <p className="whitespace-pre-wrap text-sm text-[#dce2e6]">{sub.data.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "emails" && (
          <div className="w-full">
            {emails.length === 0 ? (
              <p className="text-sm text-[#8da0aa]">Niciun log de email.</p>
            ) : (
              <table className="w-full text-left text-sm text-[#dce2e6]">
                <thead className="border-b border-[#25373f] text-xs uppercase text-[#8da0aa]">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Dată</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">ID Submisie</th>
                    <th className="pb-3 font-medium">Eroare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2c33]">
                  {emails.map((log) => (
                    <tr key={log.id} className="hover:bg-[#152026]">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {format(new Date(log.timestamp), "dd MMM HH:mm", { locale: ro })}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          log.status === "success" 
                            ? "bg-[#112b2a] text-[#d8c7a3]" 
                            : "bg-[#2f1b1d] text-[#ffc5cb]"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs opacity-70">
                        {log.submissionId.slice(0, 8)}...
                      </td>
                      <td className="py-3">
                        {log.error ? (
                          <span className="text-xs text-[#ffc5cb]">{log.error}</span>
                        ) : (
                          <span className="text-xs text-[#8da0aa]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
