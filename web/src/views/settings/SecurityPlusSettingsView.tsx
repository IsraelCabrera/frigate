import Heading from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Separator } from "../../components/ui/separator";
import ActivityIndicator from "@/components/indicators/activity-indicator";
import { toast } from "sonner";
import useSWR from "swr";
import axios from "axios";
import { SecurityConfig } from "@/types/securityConfig";
import { CheckCircle2, XCircle } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { IoIosWarning } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";
import { StatusBarMessagesContext } from "@/context/statusbar-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDocDomain } from "@/hooks/use-doc-domain";
import { CameraNameLabel } from "@/components/camera/FriendlyNameLabel";

type SecurityPlusModel = {
  id: string;
  type: string;
  name: string;
  isBaseModel: boolean;
  supportedDetectors: string[];
  trainDate: string;
  baseModel: string;
  width: number;
  height: number;
};

type SecurityPlusSettings = {
  model: {
    id?: string;
  };
};

type SecuritySettingsViewProps = {
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SecurityPlusSettingsView({
  setUnsavedChanges,
}: SecuritySettingsViewProps) {
  const { t } = useTranslation("views/settings");
  const { getLocaleDocUrl } = useDocDomain();
  const { data: config, mutate: updateConfig } =
    useSWR<SecurityConfig>("config");
  const [changedValue, setChangedValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addMessage, removeMessage } = useContext(StatusBarMessagesContext)!;

  const [securityPlusSettings, setSecurityPlusSettings] =
    useState<SecurityPlusSettings>({
      model: {
        id: undefined,
      },
    });

  const [origPlusSettings, setOrigPlusSettings] = useState<SecurityPlusSettings>(
    {
      model: {
        id: undefined,
      },
    },
  );

  const { data: availableModels = {} } = useSWR<
    Record<string, SecurityPlusModel>
  >("/plus/models", {
    fallbackData: {},
    fetcher: async (url) => {
      const res = await axios.get(url, { withCredentials: true });
      return res.data.reduce(
        (obj: Record<string, SecurityPlusModel>, model: SecurityPlusModel) => {
          obj[model.id] = model;
          return obj;
        },
        {},
      );
    },
  });

  useEffect(() => {
    if (config) {
      if (securityPlusSettings?.model.id == undefined) {
        setSecurityPlusSettings({
          model: {
            id: config.model.plus?.id,
          },
        });
      }

      setOrigPlusSettings({
        model: {
          id: config.model.plus?.id,
        },
      });
    }
    // we know that these deps are correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleSecurityPlusConfigChange = (
    newConfig: Partial<SecurityPlusSettings>,
  ) => {
    setSecurityPlusSettings((prevConfig) => ({
      model: {
        ...prevConfig.model,
        ...newConfig.model,
      },
    }));
    setUnsavedChanges(true);
    setChangedValue(true);
  };

  const saveToConfig = useCallback(async () => {
    setIsLoading(true);

    axios
      .put(`config/set?model.path=plus://${securityPlusSettings.model.id}`, {
        requires_restart: 0,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(t("securityPlus.toast.success"), {
            position: "top-center",
          });
          setChangedValue(false);
          updateConfig();
        } else {
          toast.error(
            t("securityPlus.toast.error", { errorMessage: res.statusText }),
            {
              position: "top-center",
            },
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Unknown error";
        toast.error(
          t("toast.save.error.title", { errorMessage, ns: "common" }),
          {
            position: "top-center",
          },
        );
      })
      .finally(() => {
        addMessage(
          "plus_restart",
          t("securityPlus.restart_required"),
          undefined,
          "plus_restart",
        );
        setIsLoading(false);
      });
  }, [updateConfig, addMessage, securityPlusSettings, t]);

  const onCancel = useCallback(() => {
    setSecurityPlusSettings(origPlusSettings);
    setChangedValue(false);
    removeMessage("plus_settings", "plus_settings");
  }, [origPlusSettings, removeMessage]);

  useEffect(() => {
    if (changedValue) {
      addMessage(
        "plus_settings",
        t("securityPlus.unsavedChanges"),
        undefined,
        "plus_settings",
      );
    } else {
      removeMessage("plus_settings", "plus_settings");
    }
    // we know that these deps are correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedValue]);

  useEffect(() => {
    document.title = t("documentTitle.securityPlus");
  }, [t]);

  const needCleanSnapshots = () => {
    if (!config) {
      return false;
    }
    return Object.values(config.cameras).some(
      (camera) => camera.snapshots.enabled && !camera.snapshots.clean_copy,
    );
  };

  if (!config) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <div className="flex size-full flex-col md:flex-row">
        <Toaster position="top-center" closeButton={true} />
        <div className="scrollbar-container order-last mb-10 mt-2 flex h-full w-full flex-col overflow-y-auto pb-2 md:order-none">
          <Heading as="h4" className="mb-2">
            {t("securityPlus.title")}
          </Heading>

          <Separator className="my-2 flex bg-secondary" />

          <Heading as="h4" className="my-2">
            {t("securityPlus.apiKey.title")}
          </Heading>

          <div className="mt-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {config?.plus?.enabled ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Label>
                  {config?.plus?.enabled
                    ? t("securityPlus.apiKey.validated")
                    : t("securityPlus.apiKey.notValidated")}
                </Label>
              </div>
              <div className="my-2 max-w-5xl text-sm text-muted-foreground">
                <p>{t("securityPlus.apiKey.desc")}</p>
                {!config?.model.plus && (
                  <>
                    <div className="mt-2 flex items-center text-primary-variant">
                      <Link
                        to="https://security.video/plus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline"
                      >
                        {t("securityPlus.apiKey.plusLink")}
                        <LuExternalLink className="ml-2 inline-flex size-3" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {config?.model.plus && (
              <>
                <Separator className="my-2 flex bg-secondary" />
                <div className="mt-2 max-w-2xl">
                  <Heading as="h4" className="my-2">
                    {t("securityPlus.modelInfo.title")}
                  </Heading>
                  <div className="mt-2 space-y-3">
                    {!config?.model?.plus && (
                      <p className="text-muted-foreground">
                        {t("securityPlus.modelInfo.loading")}
                      </p>
                    )}
                    {config?.model?.plus === null && (
                      <p className="text-danger">
                        {t("securityPlus.modelInfo.error")}
                      </p>
                    )}
                    {config?.model?.plus && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            {t("securityPlus.modelInfo.baseModel")}
                          </Label>
                          <p>
                            {config.model.plus.baseModel} (
                            {config.model.plus.isBaseModel
                              ? t(
                                  "securityPlus.modelInfo.plusModelType.baseModel",
                                )
                              : t(
                                  "securityPlus.modelInfo.plusModelType.userModel",
                                )}
                            )
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            {t("securityPlus.modelInfo.trainDate")}
                          </Label>
                          <p>
                            {new Date(
                              config.model.plus.trainDate,
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            {t("securityPlus.modelInfo.modelType")}
                          </Label>
                          <p>
                            {config.model.plus.name} (
                            {config.model.plus.width +
                              "x" +
                              config.model.plus.height}
                            )
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            {t("securityPlus.modelInfo.supportedDetectors")}
                          </Label>
                          <p>
                            {config.model.plus.supportedDetectors.join(", ")}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <div className="space-y-2">
                            <div className="text-md">
                              {t("securityPlus.modelInfo.availableModels")}
                            </div>
                            <div className="space-y-3 text-sm text-muted-foreground">
                              <p>
                                <Trans ns="views/settings">
                                  securityPlus.modelInfo.modelSelect
                                </Trans>
                              </p>
                            </div>
                          </div>
                          <Select
                            value={securityPlusSettings.model.id}
                            onValueChange={(value) =>
                              handleSecurityPlusConfigChange({
                                model: { id: value as string },
                              })
                            }
                          >
                            {securityPlusSettings.model.id &&
                            availableModels?.[securityPlusSettings.model.id] ? (
                              <SelectTrigger>
                                {new Date(
                                  availableModels[
                                    securityPlusSettings.model.id
                                  ].trainDate,
                                ).toLocaleString() +
                                  " " +
                                  availableModels[securityPlusSettings.model.id]
                                    .baseModel +
                                  " (" +
                                  (availableModels[securityPlusSettings.model.id]
                                    .isBaseModel
                                    ? t(
                                        "securityPlus.modelInfo.plusModelType.baseModel",
                                      )
                                    : t(
                                        "securityPlus.modelInfo.plusModelType.userModel",
                                      )) +
                                  ") " +
                                  availableModels[securityPlusSettings.model.id]
                                    .name +
                                  " (" +
                                  availableModels[securityPlusSettings.model.id]
                                    .width +
                                  "x" +
                                  availableModels[securityPlusSettings.model.id]
                                    .height +
                                  ")"}
                              </SelectTrigger>
                            ) : (
                              <SelectTrigger>
                                {t(
                                  "securityPlus.modelInfo.loadingAvailableModels",
                                )}
                              </SelectTrigger>
                            )}

                            <SelectContent>
                              <SelectGroup>
                                {Object.entries(availableModels || {}).map(
                                  ([id, model]) => (
                                    <SelectItem
                                      key={id}
                                      className="cursor-pointer"
                                      value={id}
                                      disabled={
                                        !model.supportedDetectors.includes(
                                          Object.values(config.detectors)[0]
                                            .type,
                                        )
                                      }
                                    >
                                      {new Date(
                                        model.trainDate,
                                      ).toLocaleString()}{" "}
                                      <div>
                                        {model.baseModel} {" ("}
                                        {model.isBaseModel
                                          ? t(
                                              "securityPlus.modelInfo.plusModelType.baseModel",
                                            )
                                          : t(
                                              "securityPlus.modelInfo.plusModelType.userModel",
                                            )}
                                        {")"}
                                      </div>
                                      <div>
                                        {model.name} (
                                        {model.width + "x" + model.height})
                                      </div>
                                      <div>
                                        {t(
                                          "securityPlus.modelInfo.supportedDetectors",
                                        )}
                                        : {model.supportedDetectors.join(", ")}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {id}
                                      </div>
                                    </SelectItem>
                                  ),
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator className="my-2 flex bg-secondary" />

            <div className="mt-2 max-w-5xl">
              <Heading as="h4" className="my-2">
                {t("securityPlus.snapshotConfig.title")}
              </Heading>
              <div className="mt-2 space-y-3">
                <div className="my-2 text-sm text-muted-foreground">
                  <p>
                    <Trans ns="views/settings">
                      securityPlus.snapshotConfig.desc
                    </Trans>
                  </p>
                  <div className="mt-2 flex items-center text-primary-variant">
                    <Link
                      to={getLocaleDocUrl("plus/faq")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline"
                    >
                      {t("readTheDocumentation", { ns: "common" })}
                      <LuExternalLink className="ml-2 inline-flex size-3" />
                    </Link>
                  </div>
                </div>
                {config && (
                  <div className="overflow-x-auto">
                    <table className="max-w-2xl text-sm">
                      <thead>
                        <tr className="border-b border-secondary">
                          <th className="px-4 py-2 text-left">
                            {t("securityPlus.snapshotConfig.table.camera")}
                          </th>
                          <th className="px-4 py-2 text-center">
                            {t("securityPlus.snapshotConfig.table.snapshots")}
                          </th>
                          <th className="px-4 py-2 text-center">
                            <Trans ns="views/settings">
                              securityPlus.snapshotConfig.table.cleanCopySnapshots
                            </Trans>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(config.cameras).map(
                          ([name, camera]) => (
                            <tr
                              key={name}
                              className="border-b border-secondary"
                            >
                              <td className="px-4 py-2">
                                <CameraNameLabel camera={name} />
                              </td>
                              <td className="px-4 py-2 text-center">
                                {camera.snapshots.enabled ? (
                                  <CheckCircle2 className="mx-auto size-5 text-green-500" />
                                ) : (
                                  <XCircle className="mx-auto size-5 text-danger" />
                                )}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {camera.snapshots?.enabled &&
                                camera.snapshots?.clean_copy ? (
                                  <CheckCircle2 className="mx-auto size-5 text-green-500" />
                                ) : (
                                  <XCircle className="mx-auto size-5 text-danger" />
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {needCleanSnapshots() && (
                  <div className="mt-2 max-w-xl rounded-lg border border-secondary-foreground bg-secondary p-4 text-sm text-danger">
                    <div className="flex items-center gap-2">
                      <IoIosWarning className="mr-2 size-5 text-danger" />
                      <div className="max-w-[85%] text-sm">
                        <Trans ns="views/settings">
                          securityPlus.snapshotConfig.cleanCopyWarning
                        </Trans>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-2 flex bg-secondary" />

            <div className="flex w-full flex-row items-center gap-2 pt-2 md:w-[25%]">
              <Button
                className="flex flex-1"
                aria-label={t("button.reset", { ns: "common" })}
                onClick={onCancel}
              >
                {t("button.reset", { ns: "common" })}
              </Button>
              <Button
                variant="select"
                disabled={!changedValue || isLoading}
                className="flex flex-1"
                aria-label="Save"
                onClick={saveToConfig}
              >
                {isLoading ? (
                  <div className="flex flex-row items-center gap-2">
                    <ActivityIndicator />
                    <span>{t("button.saving", { ns: "common" })}</span>
                  </div>
                ) : (
                  t("button.save", { ns: "common" })
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
