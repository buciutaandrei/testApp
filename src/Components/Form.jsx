import React from "react";
import { useForm } from "react-hook-form";

const Form = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmitForm = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form className="mainForm" onSubmit={handleSubmit(onSubmitForm)}>
      <input placeholder="Name" {...register("name")} />
      <input placeholder="First Name" {...register("firstName")} />
      <input placeholder="Age" {...register("age")} />
      <input placeholder="Gender" {...register("gender")} />
      <input type="submit" />
    </form>
  );
};

export default Form;
