import { valueRegex } from "./ValueRegistro";

// Definición de patrones RegExp para validar cada campo específico
export const regexPatterns: { [key: string]: RegExp } = {
    firstName: /^[a-zA-Z\s]{3,}$/,            // Mínimo 3 letras y espacios
    lastName: /^[a-zA-Z\s]{3,}$/,             // Mínimo 3 letras y espacios
    phoneNumber: /^\d{7,14}$/,                // Sólo números, 7-14 dígitos
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,       // Email básico
    username: /^[a-zA-Z0-9_]{3,}$/,            // Letras, números y guiones bajos, mínimo 3 caracteres
    password: /^(?=.*[a-z])(?=.*[A-Z]).{8,12}$/, // 8-12 caracteres, al menos una mayúscula y una minúscula
    birthDate: /^\d{4}-\d{2}-\d{2}$/,
    repeat_password: /^(?=.*[a-z])(?=.*[A-Z]).{8,12}$/ // Igual que password

};

// Función de validación que actualiza el estado de validación y muestra/oculta mensajes de advertencia
export function validation(
    fieldName: keyof typeof valueRegex,          // Nombre del campo que vamos a validar (ej. 'name', 'passWord')
    value: string,                                // Valor actual ingresado en el campo
    warnings: NodeListOf<HTMLParagraphElement>   // Lista de párrafos con mensajes de advertencia en el DOM
) {
    if (fieldName === "repeat_password") {
        // Validación especial para repetir contraseña
        // Busca el input de la contraseña principal para comparar
        const passwordInput = (document.querySelector('input[name="passWord"]') as HTMLInputElement);

        // Actualiza el estado de validación en valueRegex para repeat_password
        // true si las contraseñas coinciden, false si no
        valueRegex.repeat_password = value === passwordInput.value;
    } else {
        // Para los demás campos usamos el patrón regex correspondiente
        const pattern = regexPatterns[fieldName];

        if (pattern) {
            // Actualiza el estado de validación según si el valor cumple el patrón regex
            valueRegex[fieldName] = pattern.test(value);
        }
    }

    // Mostrar u ocultar mensaje de advertencia según el resultado de la validación
    warnings.forEach((p) => {
        // Compara si el párrafo de advertencia corresponde al campo actual
        if (p.getAttribute("data-name") === fieldName) {
            if (valueRegex[fieldName]) {
                // Si la validación es correcta, oculta el mensaje de advertencia
                p.classList.add("hide");
            } else {
                // Si la validación falla, muestra el mensaje de advertencia
                p.classList.remove("hide");
            }
        }
    });
}
