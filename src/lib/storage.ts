import { Dispatch, SetStateAction, useEffect, useState } from "react";

const resolveInitialValue = <T,>(initialValue: T | (() => T)) => {
  return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
};

type StorageMigration<T> = (storedValue: unknown, defaultValue: T) => T;

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  migrate?: StorageMigration<T>,
  fallbackKeys: string[] = []
): readonly [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(() => resolveInitialValue(initialValue));
  const [hydrated, setHydrated] = useState(false);
  const fallbackKeySignature = fallbackKeys.join("|");

  useEffect(() => {
    try {
      const keysToRead = [key, ...fallbackKeys];
      const storedValue = keysToRead.map((storageKey) => window.localStorage.getItem(storageKey)).find(Boolean);

      if (storedValue) {
        const defaultValue = resolveInitialValue(initialValue);
        const parsedValue = JSON.parse(storedValue) as unknown;
        setValue(migrate ? migrate(parsedValue, defaultValue) : (parsedValue as T));
      }
    } catch (error) {
      console.warn(`Unable to read ${key} from local storage`, error);
    } finally {
      setHydrated(true);
    }
  }, [initialValue, key, migrate, fallbackKeySignature]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to write ${key} to local storage`, error);
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
