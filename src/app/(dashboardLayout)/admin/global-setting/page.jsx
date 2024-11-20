"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import {
  useGetAllGlobalSettingQuery,
  useUpdateGlobalSettingMutation,
} from "@/redux/services/globalSetting/globalSettingApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { ColorPicker, Divider, Form } from "antd";
import { currencies } from "currencies.json";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminAccountSetting = () => {
  const [fields, setFields] = useState([]);
  const { data } = useGetAllGlobalSettingQuery();

  const [updateGlobalSetting, { isLoading }] = useUpdateGlobalSettingMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Global Setting...");
    try {
      const submittedData = {
        ...values,
      };

      if (typeof values?.primaryColor === "object") {
        submittedData.primaryColor = values?.primaryColor?.toHexString();
      }
      if (typeof values?.secondaryColor === "object") {
        submittedData.secondaryColor = values?.secondaryColor?.toHexString();
      }

      if (!values.logo[0].url) {
        submittedData.logo = await compressImage(values.logo[0].originFileObj);
      }
      if (!values.favicon[0].url) {
        submittedData.favicon = await compressImage(
          values.favicon[0].originFileObj
        );
      }
      const updatedUserData = new FormData();
      appendToFormData(submittedData, updatedUserData);

      const updatedData = {
        id: data?.results?._id,
        data: updatedUserData,
      };

      const res = await updateGlobalSetting(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      } else {
        toast.error(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating global setting:", error);
      toast.error("An error occurred while updating the global setting.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(data?.results));
  }, [data]);

  const currenciesOptions = currencies.map(({ name, symbol, code }) => {
    return { label: `${name} (${symbol})`, value: code };
  });

  return (
    <section className="w-4/6 mx-auto">
      <Divider orientation="left" orientationMargin={0}>
        Global Settings
      </Divider>
      <CustomForm fields={fields} onSubmit={onSubmit}>
        <CustomInput name={"name"} label={"Website Name"} required={true} />
        <CustomInput
          name={"description"}
          type={"textarea"}
          label={"Website Description"}
          required={false}
        />
        <FileUploader
          defaultValue={data?.results?.logo}
          label="Website Logo"
          name="logo"
          required={true}
        />
        <FileUploader
          defaultValue={data?.results?.favicon}
          label="Website Favicon"
          name="favicon"
          required={true}
        />
        <div className="two-grid">
          <CustomInput
            name={"businessNumber"}
            type={"text"}
            label={"Business Number"}
            required={false}
          />
          <CustomInput
            name={"businessAddress"}
            type={"text"}
            label={"Business Address"}
            required={false}
          />
          <CustomInput
            name={"businessLocation"}
            type={"text"}
            label={"Business Location"}
            required={false}
          />
          <CustomInput
            name={"businessSlogan"}
            type={"text"}
            label={"Business Slogan"}
            required={false}
          />
        </div>
        <CustomSelect
          name={"currency"}
          label={"Global Currency"}
          options={currenciesOptions}
          required={true}
        />

        <CustomSelect
          name={"ssl"}
          label={"SSL Status"}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />
        <div className="two-grid">
          <Form.Item
            name="primaryColor"
            label="Website Primary Color"
            required={true}
          >
            <ColorPicker showText />
          </Form.Item>
          <Form.Item
            name="secondaryColor"
            label="Website Secondary Color"
            required={true}
          >
            <ColorPicker showText />
          </Form.Item>
        </div>
        <div className="flex justify-center my-10">
          <SubmitButton text={"Save"} loading={isLoading} fullWidth={true} />
        </div>
      </CustomForm>
    </section>
  );
};

export default AdminAccountSetting;