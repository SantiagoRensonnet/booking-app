import styled from "styled-components";
import useAuth from "../features/authentication/useAuth";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const StyledFullPage = styled.div`
  min-height: 100vh;
  background-color:var(--color-grey-50)
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // Load the authenticated user
  const { isLoading, isAuthenticated } = useAuth();
  // If there is no auth user, re-direct to /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);
  // While loading show, spinner
  if (isLoading)
    return (
      <StyledFullPage>
        <Spinner />
      </StyledFullPage>
    );
  // If there is a user, render the app (return children)
  return children;
}
