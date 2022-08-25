import React from "react";
import useTranslation from "next-translate/useTranslation";

export default function DataLoadError() {
  const { t } = useTranslation();
  return <>{t`common:data-load-error`}</>;
}
