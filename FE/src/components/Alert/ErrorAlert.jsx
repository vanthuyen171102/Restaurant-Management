import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

function ErrorAlert({children, className}) {
  return (
    <Alert className={className} color="failure" icon={HiInformationCircle}>
      {children}
    </Alert>
  );
}

export default ErrorAlert;
