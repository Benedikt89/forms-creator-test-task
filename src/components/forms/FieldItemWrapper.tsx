import * as React from "react";
import {useCallback, useRef} from "react";
import './forms.css';
import FieldItemEditing from "./FieldItemEditing";
import {useDispatch, useSelector} from "react-redux";
import {setEditingField, updateField} from "../../redux/forms/actions";
import {AppStateType} from "../../redux/store";
import {FieldItem} from "../../types/form-types";
import FieldItemPreview from "./FieldItem";
import {DropTargetMonitor, useDrag, useDrop} from "react-dnd";
import {XYCoord} from "dnd-core";

interface IProps {
  formId: string
  userId: string
  index: number
  field: FieldItem,
  isOwner: boolean | null | undefined
  loading?: boolean | null
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const FieldItemWrapper: React.FC<IProps> = ({formId, field, index, loading, isOwner, userId, moveCard}) => {
  const {language, editingFieldId, requiredValidate} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      editingFieldId: state.forms.editingFieldId,
      requiredValidate: state.forms.requiredValidate
    }));
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: () => {
      return { id: field.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !!isOwner && !loading
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "FIELD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex
    },
  });

  const setEditingFieldCallback = useCallback(() => dispatch(setEditingField(field.id)), [field]);

  const initValue = field.values[userId] ? field.values[userId] : field.defaultValue ? field.defaultValue : '';

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} style={{opacity: opacity}} data-handler-id={handlerId}>
      {editingFieldId === field.id
        ? <FieldItemEditing formId={formId} field={field} language={language}/>
        : <FieldItemPreview
          formId={formId} field={field} initValue={initValue} language={language} isOwner={isOwner}
          onChange={(formId: string, fieldId: string, field: Partial<FieldItem>) => dispatch(updateField(formId, fieldId, field))}
          requiredValidate={requiredValidate}
          userId={userId}
          setEditingFieldCallback={setEditingFieldCallback}
        />}
    </div>
  )
};

export default FieldItemWrapper;