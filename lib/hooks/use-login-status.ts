import useSWR from "swr";
import "config/axios_configuration";
import UserService from "services/user.service";


const userService = new UserService();

function useLoginStatus(): any {
  const { data, error, mutate } = useSWR(`/user-details`, async (url) => {
    const res = await userService.getUserDetails();

    return res;
  });
  return {
    loginStatus: error
      ? ("loggedOut" as const)
      : !data
      ? ("loading" as const)
      : ("loggedIn" as const),
    user: data,
    mutate,
  };
}

export default useLoginStatus;
