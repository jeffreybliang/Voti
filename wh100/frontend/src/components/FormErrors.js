export default function FormErrors(props) {
  if (!props.errors || !props.errors.length) {
    return null
  }
  
  const errors = props.errors.filter(error => 
    (props.param ? error.param === props.param : error.param == null)
  )
  
  if (!errors.length) {
    return null
  }
  
  return (
    <ul className="text-red-700 dark:text-red-400 text-sm">
      {errors.map((e, i) => (
        <li key={i}>{e.message}</li>
      ))}
    </ul>
  )
}
