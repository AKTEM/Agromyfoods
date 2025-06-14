'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Sign Out Failed',
        description: error.message || 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-green-600">My Profile</DialogTitle>
          <DialogDescription className="text-center">
            Manage your account information and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Display */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 dark:bg-green-800 w-10 h-10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">{userProfile?.displayName || 'User'}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your full name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Profile
            </Button>
          </form>

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}