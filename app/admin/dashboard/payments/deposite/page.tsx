"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Eye, Check, X, User, Calendar, DollarSign, Clock, History,  } from "lucide-react";

interface Deposit {
  transactionId: string;
  userId: string;
  userEmail: string;
  amount: number;
  date: string;
  status: string;
  screenshotUrl?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject";
  transaction: Deposit | null;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, action, transaction }: ConfirmationModalProps) {
  if (!isOpen || !transaction) return null;

  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${isApprove ? 'bg-green-100' : 'bg-red-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${isApprove ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Confirm {isApprove ? 'Approval' : 'Rejection'}
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-2">
            Are you sure you want to <span className={`font-semibold ${isApprove ? 'text-green-600' : 'text-red-600'}`}>
              {action}
            </span> this transaction?
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">User:</span> {transaction.userEmail}</p>
            <p><span className="font-medium">Amount:</span> ₹{transaction.amount}</p>
            <p><span className="font-medium">Transaction ID:</span> {transaction.transactionId}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors cursor-pointer ${
              isApprove 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTransactions() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
    transaction: Deposit | null;
  }>({
    isOpen: false,
    action: "approve",
    transaction: null,
  });

  useEffect(() => {
    async function fetchDeposits() {
      try {
        // Fetch all deposits or only pending based on active tab
        const endpoint = activeTab === "all" 
          ? "/api/admin/wallet/deposites/all" 
          : "/api/admin/wallet/deposites";
        
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error("Failed to fetch deposits");
        }
        const data = await res.json();
        console.log("Fetched deposits:", data.deposits)
        setDeposits(data.deposits || []);
      } catch (err) {
        console.error("Error fetching deposits:", err);
      }
    }
    fetchDeposits();
  }, [activeTab]);
  

  function showConfirmation(transaction: Deposit, action: "approve" | "reject") {
    setConfirmModal({
      isOpen: true,
      action,
      transaction,
    });
  }

  function closeConfirmation() {
    setConfirmModal({
      isOpen: false,
      action: "approve",
      transaction: null,
    });
  }

  async function handleAction() {
    if (!confirmModal.transaction) return;

    try {
      const res = await fetch(`/api/admin/wallet/deposites/${confirmModal.transaction.transactionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: confirmModal.action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setDeposits((prev) =>
          prev.map((d) =>
            d.transactionId === confirmModal.transaction!.transactionId
              ? { ...d, status: data.transaction.status }
              : d
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
      approved: 'bg-green-100 text-green-800 border-green-200',
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

  // Filter deposits based on active tab
  const filteredDeposits = activeTab === "pending" 
    ? deposits.filter(d => d.status.toLowerCase() === 'pending')
    : deposits;

  const pendingCount = deposits.filter(d => d.status.toLowerCase() === 'pending').length;
  

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          </div>
          <p className="text-gray-600">Review and manage deposit transactions</p>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
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
                <p className="text-2xl font-bold text-yellow-600">
                  {deposits.filter(d => d.status.toLowerCase() === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {deposits.filter(d => d.status.toLowerCase() === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <X className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {deposits.filter(d => d.status.toLowerCase() === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "pending" ? "Pending Transactions" : "Transaction History"}
              </h2>
              <div className="text-sm text-gray-500">
                Total: {filteredDeposits.length} transactions
              </div>
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeposits.map((d) => (
                  <tr key={d.transactionId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900">₹{d.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(d.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(d.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(d)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        {d.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => showConfirmation(d, "approve")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => showConfirmation(d, "reject")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium cursor-pointer"
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
            {deposits.map((d) => (
              <div key={d.transactionId} className="bg-gray-50 rounded-xl p-4 mb-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{d.userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">{d.transactionId}</p>
                    </div>
                  </div>
                  {getStatusBadge(d.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-lg font-semibold text-gray-900">₹{d.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(d.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(d)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {d.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => showConfirmation(d, "approve")}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showConfirmation(d, "reject")}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {deposits.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">There are no deposit requests at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-xl font-bold text-gray-900">₹{selected.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
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

              <div className="p-3 bg-gray-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Transaction ID</p>
                <p className="font-mono text-sm text-gray-900 break-all">{selected.transactionId}</p>
              </div>

             
              {selected.screenshotUrl && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Payment Screenshot</p>
                  <img
                    src={selected.screenshotUrl}
                    alt="Payment Screenshot"
                    className="w-full rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {selected.status.toLowerCase() === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => showConfirmation(selected, "approve")}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    Approve Transaction
                  </button>
                  <button
                    onClick={() => showConfirmation(selected, "reject")}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                    Reject Transaction
                  </button>
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
        transaction={confirmModal.transaction}
      />
    </div>
  );
}