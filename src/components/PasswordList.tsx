
import { useState, useEffect } from "react";
import { Edit2, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EditPasswordModal from "./EditPasswordModal";

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
}

interface PasswordListProps {
  searchTerm: string;
}

const PasswordList = ({ searchTerm }: PasswordListProps) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedPasswords = localStorage.getItem("passwords");
    if (storedPasswords) {
      setPasswords(JSON.parse(storedPasswords));
    }
  }, []);

  const filteredPasswords = passwords.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const handleDelete = (id: string) => {
    const newPasswords = passwords.filter((p) => p.id !== id);
    setPasswords(newPasswords);
    localStorage.setItem("passwords", JSON.stringify(newPasswords));
    toast({
      title: "Password deleted",
      duration: 2000,
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (filteredPasswords.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No passwords found. Add your first password!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPasswords.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <div className="flex-1">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-gray-500">{p.username}</p>
            <p className="text-sm font-mono">
              {showPassword[p.id] ? p.password : "••••••••"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePasswordVisibility(p.id)}
            >
              {showPassword[p.id] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(p.password)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingPassword(p)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(p.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {editingPassword && (
        <EditPasswordModal
          password={editingPassword}
          open={!!editingPassword}
          onClose={() => setEditingPassword(null)}
          onUpdate={(updatedPassword) => {
            const newPasswords = passwords.map((p) =>
              p.id === updatedPassword.id ? updatedPassword : p
            );
            setPasswords(newPasswords);
            localStorage.setItem("passwords", JSON.stringify(newPasswords));
            setEditingPassword(null);
          }}
        />
      )}
    </div>
  );
};

export default PasswordList;
