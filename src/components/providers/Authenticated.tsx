import SignIn from "@/components/SignIn";
import { getCachedUser } from "@/server/cache";
import { type User } from "lucia";

const Authenticated = async (props: {
  children: (props: { user: User }) => React.ReactNode;
}) => {
  const user = await getCachedUser();
  return user ? <>{props.children({ user })}</> : <SignIn />;
};

export default Authenticated;
