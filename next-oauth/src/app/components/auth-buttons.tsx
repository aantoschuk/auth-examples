"use client";

import { FaGithub } from "react-icons/fa";
import { useSession, signOut, signIn } from "next-auth/react";

import { Button } from "./button";

export const AuthButtons = () => {
  const { data: session } = useSession();

  const handleGithubSignin = () => {
    signIn("github");
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
      <Button content={<FaGithub size={24} />} handler={handleGithubSignin} />
    </>
  );
};
