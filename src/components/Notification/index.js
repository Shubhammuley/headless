import { message } from "antd";

const openNotification = (type, messageText) => {
  if (type === "error" || type === "delete") {
    message.error(messageText);
  } else if (type === "warning") {
    message.info(messageText);
  } else {
    message.success(messageText);
  }
};

export default openNotification;