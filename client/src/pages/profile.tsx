import { UserProfile } from "@/components/profile/user-profile";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Alnwick Community Center</title>
        <meta
          name="description"
          content="Manage your profile settings at Alnwick Community Center."
        />
      </Helmet>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <UserProfile />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;