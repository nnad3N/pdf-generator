import { TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import Input from "./form/Input";
import { type TemplateSchema } from "@/utils/schemas";

const TemplateVariables = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TemplateSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variables",
  });

  return (
    <div className="rounded border border-base-content border-opacity-20 px-5 py-2">
      <table className="table table-sm">
        <thead>
          <tr className="border-none text-center [&_th]:pb-1">
            <th>Label</th>
            <th>Variable</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr className="border-none [&_td]:align-top" key={field.id}>
              <td>
                <Input
                  {...register(`variables.${index}.label`)}
                  placeholder="My Variable"
                  error={errors?.variables?.[index]?.label}
                />
              </td>
              <td>
                <Input
                  {...register(`variables.${index}.name`)}
                  placeholder="{{my_variable}}"
                  error={errors?.variables?.[index]?.name}
                />
              </td>
              <td>
                <select
                  {...register(`variables.${index}.type`)}
                  className="select select-bordered w-full"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </td>
              <td className="px-0">
                <div className="flex h-12 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className={`btn btn-square btn-ghost btn-sm hover:bg-opacity-0 hover:text-red-600 ${
                      fields.length === 1 ? "btn-disabled" : "text-red-500"
                    }`}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            append({
              label: "",
              name: "",
              type: "text",
            })
          }
          className="btn btn-ghost btn-sm my-2 text-accent"
        >
          NEW VARIABLE
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TemplateVariables;
