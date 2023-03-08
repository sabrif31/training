import { FC, ReactElement, MouseEvent } from 'react'
import { Button } from '@mui/material'
import styled from '@emotion/styled'

type ButtonProps = {
  readonly children?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  readonly type?: 'submit' | 'reset' | 'button' | undefined
  readonly variant?: 'contained' | 'outlined' | 'text'
  readonly disabled?: boolean
  readonly className?: string
  readonly sx?: object
}

const CustomButton: FC<ButtonProps> = (props: ButtonProps): ReactElement => {
  return (
    <FormButton
      type={props.type}
      variant={props.variant}
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
      sx={props.sx}
    >
      {props.children}
    </FormButton>
  )
}
/*
const defaultProps: ButtonProps = {
    children: 'Save',
    type: "button",
    variant: "contained",
};
CustomButton.defaultProps = defaultProps;
*/

export default CustomButton

const FormButton = styled(Button)`
  margin: 0 0 8px 0;
  height: 40px;
  width: 100%;
  box-shadow: none;
  text-transform: none;
  border-radius: 10px;
`
