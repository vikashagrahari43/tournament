"use client";
import React, { useEffect, useState } from "react";
import TeamDas from "@/component/TeamDas";

type Member = {
  name: string;
  bgmiId: number | null;
  role: string;
};

export default function MainTeam() {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingTeam, setFetchingTeam] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [form, setForm] = useState<{ name: string; members: Member[] }>({
    name: "",
    members: [{ name: "", bgmiId: null , role: "" }],
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
      members: [...form.members, { name: "", bgmiId: null, role: "" }],
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
      if (!m.name.trim() || !m.bgmiId || !m.role.trim()) {
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

  const handleFetchTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!teamIdInput.trim()) {
      return setError("Please enter a Team ID");
    }

    setFetchingTeam(true);
    try {
      const res = await fetch(`/api/team/${teamIdInput}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTeam(data.team);
        setShowJoinForm(false);
        setTeamIdInput("");
      } else {
        setError(data.message || "Team not found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setFetchingTeam(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (team) return <TeamDas team={team} />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">Team Management</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setShowJoinForm(false)}
          className={`px-6 py-2 rounded transition cursor-pointer ${
            !showJoinForm
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          Create New Team
        </button>
        <button
          onClick={() => setShowJoinForm(true)}
          className={`px-6 py-2 rounded transition cursor-pointer ${
            showJoinForm
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          Join Existing Team
        </button>
      </div>

      {/* Join Team Form */}
      {showJoinForm ? (
        <form onSubmit={handleFetchTeam} className="space-y-4">
          <div className="border-2 border-blue-300 rounded-lg p-6 bg-black">
            <h3 className="text-lg font-semibold mb-4">Enter Team ID</h3>
            <input
              type="text"
              placeholder="Enter Team ID"
              value={teamIdInput}
              onChange={(e) => setTeamIdInput(e.target.value)}
              className="border p-3 rounded w-full mb-4"
              required
            />
            <button
              type="submit"
              disabled={fetchingTeam}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-blue-700 cursor-pointer w-full"
            >
              {fetchingTeam ? "Fetching Team..." : "Fetch Team"}
            </button>
          </div>
          {error && <div className="text-red-500 font-medium text-center">{error}</div>}
        </form>
      ) : (
        /* Create Team Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-bold">Create Your Team</h3>

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
                value={member.bgmiId || ""}
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
                  className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs cursor-pointer"
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
      )}
    </div>
  );
}