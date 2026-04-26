import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import ChangePasswordForm from "../features/authentication/ChangePasswordForm";
function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3">Change password</Heading>
        <ChangePasswordForm />
      </Row>
    </>
  );
}

export default Account;
