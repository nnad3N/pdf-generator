"use client";

import { api } from "@/utils/api";
import { Cog6ToothIcon, UserPlusIcon } from "@heroicons/react/20/solid";

export default function Page() {
  const [data] = api.user.getAll.useSuspenseQuery();

  return (
    <div className="rounded-box w-full max-w-3xl bg-base-200 p-5">
      <table className="table [&_tr]:border-base-100">
        <thead>
          <tr>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr
              className={user.isDeactivated ? "deactivated" : ""}
              key={user.id}
            >
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Admin" : "User"}</td>
              <td className="w-12">
                <button className="flex w-max items-center">
                  <Cog6ToothIcon className="h-5 w-5 fill-accent hover:fill-accent-focus" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-sm mx-auto mt-5 flex border-none text-accent hover:bg-transparent hover:text-accent-focus">
        Add new <UserPlusIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
