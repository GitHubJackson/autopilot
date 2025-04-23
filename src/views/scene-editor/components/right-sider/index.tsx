import { Form, Input, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { editorStore } from "../../store";
import "./index.css";

export const RightSider = observer(() => {
  const { selectedElement } = editorStore;
  const [form] = Form.useForm();

  const onFormChange = (values: any) => {
    console.log("==values", values);
    const key = Object.keys(values)[0];
    const value = values[key];
    selectedElement?.setAttr(key, value);
  };

  useEffect(() => {
    if (selectedElement) {
      form.setFieldsValue({
        name: selectedElement.name(),
        height: 2,
        length: selectedElement.height,
        width: selectedElement.width(),
        speed: selectedElement.getAttr("speed"),
        x: selectedElement.x(),
        y: selectedElement.y(),
      });
    } else {
      form.resetFields();
    }
  }, [selectedElement]);

  return (
    <div className="scene-editor-right-sider">
      <div className="title">属性面板</div>
      <div className="content">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onValuesChange={onFormChange}
          // initialValues={{ remember: true }}
        >
          <Form.Item
            label="名称"
            name="name"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="颜色"
            name="color"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="高度"
            name="height"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="速度"
            name="speed"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="长度"
            name="length"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="宽度"
            name="width"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="x"
            name="x"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="y"
            name="y"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>
          {/* <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
        </Form>
      </div>
    </div>
  );
});
