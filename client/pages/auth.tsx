import { useState, useEffect } from "react";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      loginMutation.mutate(data);
    } catch (error) {
      console.error("Login submission error:", error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      registerMutation.mutate(data);
    } catch (error) {
      console.error("Registration submission error:", error);
    }
  };

  // If already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign In | Alnwick Community Center</title>
        <meta
          name="description"
          content="Sign in or register for an account at Alnwick Community Center to manage bookings and stay updated with events."
        />
      </Helmet>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="max-w-md mx-auto">
                  <Tabs
                    defaultValue="login"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sign In</CardTitle>
                          <CardDescription>
                            Enter your credentials to access your account.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...loginForm}>
                            <form
                              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                              className="space-y-4"
                            >
                              <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="you@example.com"
                                        type="email"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="••••••••"
                                        type="password"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                              >
                                {loginMutation.isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign In
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button
                            variant="link"
                            onClick={() => setActiveTab("register")}
                          >
                            Don't have an account? Register
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>

                    <TabsContent value="register">
                      <Card>
                        <CardHeader>
                          <CardTitle>Create Account</CardTitle>
                          <CardDescription>
                            Register to book rooms and keep track of events.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...registerForm}>
                            <form
                              onSubmit={registerForm.handleSubmit(
                                onRegisterSubmit
                              )}
                              className="space-y-4"
                            >
                              <FormField
                                control={registerForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="John Doe"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="you@example.com"
                                        type="email"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="••••••••"
                                        type="password"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="••••••••"
                                        type="password"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button
                                type="submit"
                                className="w-full"
                                disabled={registerMutation.isPending}
                              >
                                {registerMutation.isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Account
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button
                            variant="link"
                            onClick={() => setActiveTab("login")}
                          >
                            Already have an account? Sign In
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-primary text-white p-8 rounded-lg">
                  <h2 className="text-3xl font-bold mb-4">
                    Welcome to Alnwick Community Center
                  </h2>
                  <p className="mb-6">
                    Create an account to get access to exclusive features:
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Book rooms for events and activities</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Track your bookings and reservations</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Register for community events</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Volunteer for community initiatives</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>See personalized recommendations</span>
                    </li>
                  </ul>
                  <div className="text-sm opacity-80">
                    Alnwick Community Center - Building a stronger community
                    together.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthPage;