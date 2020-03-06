import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  ListItemIcon,
  Checkbox
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import { useFieldArray } from "react-hook-form";
import { INotesTodo } from "components/dashboard/context/notes/INotesTodo";

interface Props {
  control: any;
  register: any;
  loading: boolean;
  initialValue?: INotesTodo[];
  currentValue?: any;
}

type TodoPartialProps = Props;

export const TodoPartial: React.FC<TodoPartialProps> = props => {

  /* ============================================ PROPS =============================================== */
  
  const { control, register, initialValue, loading } = props;
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'todo'
  })

  /* ============================================ USESTATE ============================================ */
  
  const [todo, setTodo] = React.useState<string>('');
  const [itemCheck, setItemCheck] = React.useState<boolean[]>([]);

  /* ============================================ USECONTEXT ========================================== */
  
  
  /* ============================================ USEEFFECT =========================================== */
  
  React.useEffect(() => {
    setTodo('')
    if (initialValue) {
      const item: boolean[] = [];
      initialValue.map(itm => item.push(itm.value))
      setItemCheck(item)
    }
  }, [initialValue])

  /* ============================================ OTHERS ============================================== */
  
  const handleAddTodo = () => {
    prepend({ name: todo, value: false })
    setItemCheck([false].concat(itemCheck));
    setTodo('');
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        prepend({ name: todo, value: false })
        setItemCheck([false].concat(itemCheck));
        setTodo('');
        break
      case 'Escape':
        // etc...
        break
      default: break
    }
  }

  const handleCheck = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    itemCheck[index] = e.target.checked;
    setItemCheck([...itemCheck])
  }

  /* ============================================ VIEW ================================================ */

  return (
    <Paper style={{ height: "100%", overflowX: 'auto'}}>
      <List style={{paddingTop: 0}}>
        <div style={{backgroundColor: '#6c7b95', zIndex: 1000, position: 'sticky', top: 0}}>
          <ListItem ContainerProps={{ style: { paddingLeft: '54px', paddingRight: '32px' } }}>
            <ListItemText primary={
              <TextField 
                fullWidth 
                disabled={loading}
                placeholder="Type here..." 
                value={todo} 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setTodo(event.target.value)
                }
                onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)} 
              />
            } />
            <ListItemSecondaryAction>
              <IconButton onClick={handleAddTodo} disabled={loading} >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </div>
        
        {fields.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    // edge="start"
                    color="primary"
                    tabIndex={-1}
                    // disableRipple
                    disabled={loading}
                    // defaultChecked={item.value}
                    value={itemCheck[index]}
                    checked={itemCheck[index]}
                    onChange={handleCheck(index)}
                    name={`todo[${index}].value`}
                    inputRef={register({})}
                  />
                </ListItemIcon>
                <ListItemText 
                  style={{paddingRight: '32px'}}
                  primary={
                    <TextField 
                      fullWidth 
                      disabled={loading}
                      InputProps={{
                        disableUnderline: itemCheck[index],
                        readOnly: itemCheck[index]
                      }}
                      placeholder="Type here..." 
                      defaultValue={`${item.name}`}
                      name={`todo[${index}].name`}
                      inputRef={register({})}
                    />
                  } 
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => remove(index)} disabled={loading} >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {
                index !== fields.length - 1 &&
                <Divider />
              }
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};
