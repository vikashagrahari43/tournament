"use client";
import React, { useEffect, useState } from "react";
import TeamDas from "@/component/TeamDas";

type Member = {
  name: string;
  bgmiId: string;
  role: string;
};

export default function MainTeam() {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{ name: string; members: Member[] }>({
    name: "",
    members: [{ name: "", bgmiId: "", role: "" }],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/team/myteam")
      .then((res) => res.json())
      .then((data) => {
        if (data.team) setTeam(data.team);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFormChange = (idx: number, field: keyof Member, value: string) => {
    const members = [...form.members];
    members[idx] = { ...members[idx], [field]: value };
    setForm({ ...form, members });
  };

  const addMember = () => {
    setForm({
      ...form,
      members: [...form.members, { name: "", bgmiId: "", role: "" }],
    });
  };

  const removeMember = (idx: number) => {
    if (form.members.length > 1) {
      setForm({
        ...form,
        members: form.members.filter((_, i) => i !== idx),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // validation
    if (!form.name.trim()) {
      return setError("Team name is required");
    }
    for (let m of form.members) {
      if (!m.name.trim() || !m.bgmiId.trim() || !m.role.trim()) {
        return setError("All member fields (name, BGMI ID, role) must be filled");
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setTeam(data.team);
      } else {
        setError(data.error || "Failed to create team");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (team) return <TeamDas team={team} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">Create Your Team</h2>

      {/* Team Name */}
      <input
        type="text"
        placeholder="Team Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded w-full"
        required
      />

      {/* Members */}
      {form.members.map((member, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 gap-2 items-center border p-3 rounded relative"
        >
          <input
            type="text"
            placeholder="Player Name"
            value={member.name}
            onChange={(e) => handleFormChange(idx, "name", e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="BGMI ID"
            value={member.bgmiId}
            onChange={(e) => handleFormChange(idx, "bgmiId", e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Role (IGL, Support, Entry, etc.)"
            value={member.role}
            onChange={(e) => handleFormChange(idx, "role", e.target.value)}
            className="border p-2 rounded"
            required
          />
          {form.members.length > 1 && (
            <button
              type="button"
              onClick={() => removeMember(idx)}
              className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addMember}
        className="bg-gray-200 text-black hover:bg-amber-600 px-4 py-2 rounded cursor-pointer" 
      >
        + Add Member
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-500 cursor-pointer"
      >
        {submitting ? "Creating..." : "Create Team"}
      </button>

      {error && <div className="text-red-500 font-medium">{error}</div>}
    </form>
  );
}
