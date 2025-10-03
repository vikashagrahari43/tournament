"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Eye, Check, X, User, Calendar, DollarSign, Clock, History, CreditCard } from "lucide-react";

interface WithdrawRequest {
  _id: string;
  userId: string;
  userEmail: string;
  amount: number;
  upiId: string;
  date: string;
  status: "pending" | "completed" | "rejected";
  requestDate: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "complete" | "reject";
  request: WithdrawRequest | null;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, action, request }: ConfirmationModalProps) {
  if (!isOpen || !request) return null;

  const isComplete = action === "complete";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${isComplete ? 'bg-green-100' : 'bg-red-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${isComplete ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Confirm {isComplete ? 'Completion' : 'Rejection'}
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-2">
            Are you sure you want to <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-red-600'}`}>
              {action}
            </span> this withdrawal request?
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">User:</span> {request.userEmail}</p>
            <p><span className="font-medium">Amount:</span> ₹{request.amount.toLocaleString()}</p>
            <p><span className="font-medium">UPI ID:</span> {request.upiId}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
              isComplete 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isComplete ? 'Complete Payment' : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminWithdrawManagement() {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [selected, setSelected] = useState<WithdrawRequest | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "complete" | "reject";
    request: WithdrawRequest | null;
  }>({
    isOpen: false,
    action: "complete",
    request: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWithdrawRequests() {
      try {
        setLoading(true);
        const endpoint = activeTab === "all" 
          ? "/api/admin/wallet/withdrawals/all" 
          : "/api/admin/wallet/withdrawals";
        
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error("Failed to fetch withdrawal requests");
        }
        const data = await res.json();
        setWithdrawRequests(data.withdrawals || []);
      } catch (err) {
        console.error("Error fetching withdrawal requests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWithdrawRequests();
  }, [activeTab]);

  function showConfirmation(request: WithdrawRequest, action: "complete" | "reject") {
    setConfirmModal({
      isOpen: true,
      action,
      request,
    });
  }

  function closeConfirmation() {
    setConfirmModal({
      isOpen: false,
      action: "complete",
      request: null,
    });
  }

  async function handleAction() {
    if (!confirmModal.request) return;

    try {
      const res = await fetch(`/api/admin/wallet/withdrawals/${confirmModal.request._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: confirmModal.action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setWithdrawRequests((prev) =>
          prev.map((r) =>
            r._id === confirmModal.request!._id
              ? { ...r, status: data.withdrawal.status }
              : r
          )
        );
        setSelected(null);
        closeConfirmation();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Action error:", err);
      alert("Failed to perform action");
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
        statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {status}
      </span>
    );
  };

  const filteredRequests = activeTab === "pending" 
    ? withdrawRequests.filter(r => r.status.toLowerCase() === 'pending')
    : withdrawRequests;

  const pendingCount = withdrawRequests.filter(r => r.status.toLowerCase() === 'pending').length;
  const completedCount = withdrawRequests.filter(r => r.status.toLowerCase() === 'completed').length;
  const rejectedCount = withdrawRequests.filter(r => r.status.toLowerCase() === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading withdrawal requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
          </div>
          <p className="text-gray-600">Review and process withdrawal requests</p>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "pending"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending Requests
              {pendingCount > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <History className="w-4 h-4" />
              All History
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <X className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "pending" ? "Pending Withdrawal Requests" : "Withdrawal History"}
              </h2>
              <div className="text-sm text-gray-500">
                Total: {filteredRequests.length} requests
              </div>
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.userEmail}</p>
                          <p className="text-xs text-gray-500">{request.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 font-mono">{request.upiId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900">₹{request.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(request)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        {request.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => showConfirmation(request, "complete")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                            >
                              <Check className="w-4 h-4" />
                              Complete
                            </button>
                            <button
                              onClick={() => showConfirmation(request, "reject")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-gray-50 rounded-xl p-4 mb-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">{request.userId}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">UPI:</span>
                    <span className="font-mono text-gray-900">{request.upiId}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-lg font-semibold text-gray-900">₹{request.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(request.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(request)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {request.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => showConfirmation(request, "complete")}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showConfirmation(request, "reject")}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal requests found</h3>
              <p className="text-gray-500">
                {activeTab === "pending" 
                  ? "There are no pending withdrawal requests at the moment."
                  : "No withdrawal history available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Withdrawal Request Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">User Email</p>
                      <p className="font-medium text-gray-900">{selected.userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Withdrawal Amount</p>
                      <p className="text-xl font-bold text-gray-900">₹{selected.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Request Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selected.date).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    {getStatusBadge(selected.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">UPI ID</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <p className="font-mono text-sm text-gray-900">{selected.upiId}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Request ID</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{selected._id}</p>
                </div>
              </div>

              {selected.status.toLowerCase() === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => showConfirmation(selected, "complete")}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    <Check className="w-5 h-5" />
                    Complete Payment
                  </button>
                  <button
                    onClick={() => showConfirmation(selected, "reject")}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    <X className="w-5 h-5" />
                    Reject Request
                  </button>
                </div>
              )}

              {selected.status.toLowerCase() === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <p className="font-medium">Payment completed successfully</p>
                  </div>
                </div>
              )}

              {selected.status.toLowerCase() === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <X className="w-5 h-5" />
                    <p className="font-medium">Request was rejected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleAction}
        action={confirmModal.action}
        request={confirmModal.request}
      />
    </div>
  );
}