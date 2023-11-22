import { useState } from "react";

/**
 * @param initialData Data of with type of T
 * @returns Array of currentData with type of T, update function, and reset function
 */
export function useForm<T>(initialData: T): [T, (e: React.ChangeEvent) => void, () => void] {
  const [formState, setFormState] = useState<T>(initialData);

  /**
   * Gets key from element name and value from element. Must set name attribute.
   * <input name="key1" onChange={update}/> will set the value of {key1: value}
   * 
   * @param e The event from input element
   * @throws '"name" attribute value must be a member of initialData' if name attribute doesn't exist on initialData
   */
  function update(e: React.ChangeEvent<any>) {
    const key = e.target.name as keyof typeof initialData;
    if (initialData[key] === undefined) {
      throw new ReferenceError(`"${String(key)}" name attribute must be a member of initialData`)
    }
    const value = e.target.value

    setFormState((prev) => {
      const cloneState = {...prev};
      cloneState[key] = value;
      return cloneState;
    });
  }
  
  /**
   * Resets the form data to initial state
   */
  function clear() {
    setFormState(initialData);
  }

  return [formState, update,  clear];
}