const Checkbox = ({ label, checked, onChange, name }) => {
    return (  
        <label>
            <input type="checkbox" checked={checked} onChange={onChange} name={name} />
            {label}
        </label>
    );
}
 
export default Checkbox;