import * as React from "react";
import {useState} from "react";
import {Typography} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import './forms.css';

const { Text, Link, Title } = Typography;


interface IProps {
  title: string
  description: string
  onChange: (val: string) => void
  onDelete: () => void
}

const FormHeader: React.FC<IProps> = ({title, description, onChange, onDelete}) => {
  const [editing, setEditing] = useState<string>('');

  return (
    <div className="form-item-wrapper">
      <h2 className="form-title">{title}<EditOutlined className="icon-button" style={{color: '#177ddc'}} /></h2>
      <Text >{description}</Text>
      <DeleteOutlined className="icon-button form-item-header-icon" style={{color: '#177ddc'}}
                    onClick={onDelete}/>
    </div>
  )
};

export default FormHeader;