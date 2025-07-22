"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSession, signOut, signIn } from "next-auth/react";

import { Button } from "./button";

export const AuthButtons = () => {
  const { data: session } = useSession();

  const handleGithubSignin = () => {
    signIn("github");
  };

  const handleGoogleSignin = () => {
    signIn("google");
  };

  const handleLogout = () => {
    signOut();
  };

  return session ? (
    <>
      <p>Welcome {session.user?.name}</p>
      <Button content={<p>Log out</p>} handler={handleLogout} border />
    </>
  ) : (
    <>
      <h2>Select login option</h2>
      <div className="flex">
        <Button content={<FaGithub size={24} />} handler={handleGithubSignin} />
        <Button content={<FaGoogle size={24} />} handler={handleGoogleSignin} />
      </div>
    </>
  );
};
