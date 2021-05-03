import * as React from "react";
import {useEffect, useState} from "react";
import {DeleteOutlined, EditOutlined, CheckOutlined, LoadingOutlined} from '@ant-design/icons';
import './forms.css';

interface IProps {
  title: string
  description: string
  isOwner: boolean | null | undefined
  onChange: (key: string, val: string) => void
  onDelete: () => void
  loading?: boolean | null
}

const FormHeader: React.FC<IProps> = ({title, description, onChange, onDelete, isOwner, loading}) => {
  const [editing, setEditing] = useState<string>('');
  const [value, setValue] = useState<string>(title);

  useEffect(() => {
    if (editing) {
      setValue(editing === 'title' ? title : description)
    }
  }, [editing]);

  const renderIcon = (key: string) => !isOwner ? null : loading ? <LoadingOutlined className="icon-button"/>
    : editing === key
      ? <CheckOutlined onClick={() => {
        onChange(editing, value);
        setEditing('');
      }} className="icon-button" style={{color: '#177ddc'}}/>
      : <EditOutlined onClick={() => setEditing(key)} className="icon-button" style={{color: '#177ddc'}}/>;

  const renderInput = () =>
    <input className="ant-input" type="text" value={value} onChange={(event) => setValue(event.target.value)}/>;

  return (
    <div className="form-item-wrapper">
      <h2 className="form-title">
        {editing === 'title'
          ? renderInput()
          : title
        }
        {renderIcon('title')}
      </h2>
      <div className="form-item-content">
        {editing === 'description'
          ? renderInput()
          : description
        }
        {renderIcon('description')}
      </div>
      {isOwner && <DeleteOutlined className="icon-button form-item-header-icon" style={{color: '#177ddc'}}
                    onClick={onDelete}/>}
    </div>
  )
};

export default FormHeader;