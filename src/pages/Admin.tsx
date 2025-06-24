import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import TradingCategoryCard from "@/components/TradingCategoryCard";
import PnlReportLogs, { Trade } from "@/components/PnlReportLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/utils/api";

// Add the missing mockUsers definition
const mockUsers = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Singh" },
];

// Simulated per-user config (here, using the same one from Index for demo)
const sampleInstrumentConfig = {
  FOREX: [
    { symbol: "EUR/USD", value: "0.1", enabled: true },
    { symbol: "USD/JPY", value: "0.01", enabled: true },
    { symbol: "GBP/USD", value: "0.01", enabled: true },
    { symbol: "USD/CHF", value: "0.01", enabled: true },
    { symbol: "AUD/USD", value: "0.01", enabled: false },
    { symbol: "USD/CAD", value: "0.01", enabled: true },
    { symbol: "NZD/USD", value: "0.01", enabled: true },
  ],
  COMEX: [
    { symbol: "XAU/USD", value: "0.1", enabled: true },
    { symbol: "XAG/USD", value: "0.01", enabled: true },
    { symbol: "WTI", value: "1.0", enabled: true },
    { symbol: "BRENT", value: "0.01", enabled: true },
    { symbol: "NG", value: "0.01", enabled: false },
    { symbol: "HG", value: "0.01", enabled: true },
    { symbol: "PL", value: "0.01", enabled: true },
    { symbol: "PA", value: "0.01", enabled: false },
  ],
  STOCKS: [
    { symbol: "AAPL", value: "0.01", enabled: true },
    { symbol: "MSFT", value: "0.01", enabled: true },
    { symbol: "AMZN", value: "0.01", enabled: true },
    { symbol: "TSLA", value: "0.01", enabled: true },
    { symbol: "GOOGL", value: "0.01", enabled: true },
    { symbol: "META", value: "0.01", enabled: true },
    { symbol: "BRK.B", value: "0.01", enabled: true },
    { symbol: "JPM", value: "0.01", enabled: true },
    { symbol: "V", value: "0.01", enabled: true },
    { symbol: "JNJ", value: "0.01", enabled: true },
    { symbol: "NVDA", value: "0.01", enabled: true },
    { symbol: "PG", value: "0.01", enabled: true },
  ],
  CRYPTO: [
    { symbol: "BTC/USD", value: "0.2", enabled: true },
    { symbol: "ETH/USD", value: "0.01", enabled: true },
    { symbol: "BNB/USD", value: "0.01", enabled: true },
    { symbol: "XRP/USD", value: "0.01", enabled: false },
    { symbol: "SOL/USD", value: "0.01", enabled: true },
    { symbol: "ADA/USD", value: "0.01", enabled: true },
    { symbol: "DOGE/USD", value: "0.01", enabled: false },
    { symbol: "AVAX/USD", value: "0.01", enabled: true },
    { symbol: "MATIC/USD", value: "0.01", enabled: true },
    { symbol: "DOT/USD", value: "0.01", enabled: false },
  ],
};
const categoryOrder: ("FOREX" | "COMEX" | "STOCKS" | "CRYPTO")[] = [
  "FOREX", "COMEX", "STOCKS", "CRYPTO"
];

// Example fake per-user trades. In future, fetch from backend (Supabase).
const userTrades: Record<number, Trade[]> = {
  1: [
    {
      id: 1122,
      entryTime: new Date("2025-03-01T10:10:00"),
      symbol: "EUR/USD",
      type: "BUY",
      quantity: 0.12,
      entryPrice: 1000,
      exitTime: new Date("2025-03-01T12:12:00"),
      exitPrice: 1015,
      pnl: 18,
    },
  ],
  2: [
    {
      id: 2222,
      entryTime: new Date("2025-04-05T09:00:00"),
      symbol: "XAU/USD",
      type: "SELL",
      quantity: 0.1,
      entryPrice: 2555,
      exitTime: new Date("2025-04-05T15:30:00"),
      exitPrice: 2538,
      pnl: 170,
    },
  ],
};

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Franchise {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  is_read: boolean;
}

interface TradingConfig {
  FOREX: Array<{ symbol: string; value: string; enabled: boolean }>;
  COMEX: Array<{ symbol: string; value: string; enabled: boolean }>;
  STOCKS: Array<{ symbol: string; value: string; enabled: boolean }>;
  CRYPTO: Array<{ symbol: string; value: string; enabled: boolean }>;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userConfig, setUserConfig] = useState<TradingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradesByUser, setTradesByUser] = useState(userTrades);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add base URL constant
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        navigate('/');
        return;
      }

      const data = await api.get(`/check-admin/${user.id}/`);
      
      if (!data.is_admin) {
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      fetchData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserConfig(selectedUser);
    }
  }, [selectedUser]);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersData = await api.get('/users/');
      setUsers(usersData);

      // Fetch contacts
      const contactsData = await api.get('/contacts/');
      setContacts(contactsData);

      // Fetch franchises
      const franchisesData = await api.get('/franchises/');
      setFranchises(franchisesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchUserConfig = async (userId: number) => {
    try {
      const data = await api.get(`/trading-config/?user_id=${userId}`);
      setUserConfig(data);
    } catch (error) {
      console.error('Error fetching user config:', error);
    }
  };

  const handleStatusChange = async (franchiseId: number, newStatus: string) => {
    try {
      await api.patch(`/franchises/${franchiseId}/`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReadStatusChange = async (type: 'contact' | 'franchise', id: number) => {
    try {
      const endpoint = type === 'contact' ? 'contacts' : 'franchises';
      await api.patch(`/${endpoint}/${id}/`, { is_read: true });
      fetchData();
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  function handleTradesChange(userId: number, trades: Trade[]) {
    setTradesByUser(prev => ({ ...prev, [userId]: trades }));
    // In production: Make backend API call here to sync changes
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="text-brand text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand">Admin Dashboard</h1>
        <button
          className="text-brand border border-brand rounded px-4 py-2 hover:bg-brand hover:text-white transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-[#232323]">
            <TabsTrigger value="users" className="text-brand">Users</TabsTrigger>
            <TabsTrigger value="user-dashboard" className="text-brand">User Dashboard</TabsTrigger>
            <TabsTrigger value="contacts" className="text-brand">Contacts</TabsTrigger>
            <TabsTrigger value="franchises" className="text-brand">Franchises</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-[#232323] border-brand/20">
              <CardHeader>
                <CardTitle className="text-brand">Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-brand/20">
                      <TableHead className="text-brand">Username</TableHead>
                      <TableHead className="text-brand">Name</TableHead>
                      <TableHead className="text-brand">Email</TableHead>
                      <TableHead className="text-brand">Phone</TableHead>
                      <TableHead className="text-brand">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-brand/20">
                        <TableCell className="text-brand/80">{user.username}</TableCell>
                        <TableCell className="text-brand/80">{user.name}</TableCell>
                        <TableCell className="text-brand/80">{user.email}</TableCell>
                        <TableCell className="text-brand/80">{user.phone}</TableCell>
                        <TableCell className="text-brand/80">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-dashboard">
            <Card className="bg-[#232323] border-brand/20">
              <CardHeader>
                <CardTitle className="text-brand">User Trading Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Select
                    value={selectedUser?.toString()}
                    onValueChange={(value) => setSelectedUser(parseInt(value))}
                  >
                    <SelectTrigger className="w-[300px] bg-[#232323] text-brand border-brand/20">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#232323] text-brand border-brand/20">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.username}
                        </SelectItem>
              ))}
                    </SelectContent>
                  </Select>
        </div>

                {selectedUser && userConfig ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-brand mb-4">
                      Trading Configuration for {users.find(u => u.id === selectedUser)?.username}
          </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {categoryOrder.map((category) => (
                        <Card key={category} className="bg-[#232323] border-brand/20">
                          <CardHeader>
                            <CardTitle className="text-brand">{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-brand/20">
                                  <TableHead className="text-brand">Symbol</TableHead>
                                  <TableHead className="text-brand">Value</TableHead>
                                  <TableHead className="text-brand">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userConfig[category].map((instrument) => (
                                  <TableRow key={instrument.symbol} className="border-brand/20">
                                    <TableCell className="text-brand/80">{instrument.symbol}</TableCell>
                                    <TableCell className="text-brand/80">{instrument.value}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={instrument.enabled ? "default" : "secondary"}
                                      >
                                        {instrument.enabled ? "Enabled" : "Disabled"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
            ))}
          </div>
                  </div>
                ) : (
                  <div className="text-brand/80 text-center py-8">
                    Select a user to view their trading configuration
          </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="bg-[#232323] border-brand/20">
              <CardHeader>
                <CardTitle className="text-brand">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-brand/20">
                      <TableHead className="text-brand">Name</TableHead>
                      <TableHead className="text-brand">Email</TableHead>
                      <TableHead className="text-brand">Message</TableHead>
                      <TableHead className="text-brand">Date</TableHead>
                      <TableHead className="text-brand">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id} className="border-brand/20">
                        <TableCell className="text-brand/80">{contact.name}</TableCell>
                        <TableCell className="text-brand/80">{contact.email}</TableCell>
                        <TableCell className="text-brand/80 max-w-xs truncate">{contact.message}</TableCell>
                        <TableCell className="text-brand/80">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={contact.is_read ? "secondary" : "default"}
                            className="cursor-pointer"
                            onClick={() => handleReadStatusChange('contact', contact.id)}
                          >
                            {contact.is_read ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="franchises">
            <Card className="bg-[#232323] border-brand/20">
              <CardHeader>
                <CardTitle className="text-brand">Franchise Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-brand/20">
                      <TableHead className="text-brand">Name</TableHead>
                      <TableHead className="text-brand">Email</TableHead>
                      <TableHead className="text-brand">Phone</TableHead>
                      <TableHead className="text-brand">Message</TableHead>
                      <TableHead className="text-brand">Status</TableHead>
                      <TableHead className="text-brand">Date</TableHead>
                      <TableHead className="text-brand">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {franchises.map((franchise) => (
                      <TableRow key={franchise.id} className="border-brand/20">
                        <TableCell className="text-brand/80">{franchise.name}</TableCell>
                        <TableCell className="text-brand/80">{franchise.email}</TableCell>
                        <TableCell className="text-brand/80">{franchise.phone}</TableCell>
                        <TableCell className="text-brand/80 max-w-xs truncate">{franchise.message}</TableCell>
                        <TableCell>
                          <select
                            value={franchise.status}
                            onChange={(e) => handleStatusChange(franchise.id, e.target.value)}
                            className="bg-[#232323] text-brand border border-brand/20 rounded px-2 py-1"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="APPROVED">Approved</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-brand/80">
                          {new Date(franchise.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={franchise.is_read ? "secondary" : "default"}
                            className="cursor-pointer"
                            onClick={() => handleReadStatusChange('franchise', franchise.id)}
                          >
                            {franchise.is_read ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
