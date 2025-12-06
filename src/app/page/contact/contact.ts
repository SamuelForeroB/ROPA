import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  // FormGroup que contiene todos los controles del formulario
  contactForm!: FormGroup;
  
  // Bandera para deshabilitar botones mientras se procesa
  submitting = false;
  
  // Mensajes opcionales de feedback
  mensajeExito = '';
  mensajeError = '';

  constructor(private fb: FormBuilder) {
    // ============================================================
    // INICIALIZACIÓN DEL FORMULARIO REACTIVO
    // ============================================================
    // Creamos el FormGroup con validaciones para cada campo
    this.contactForm = this.fb.group({
      // NOMBRE: requerido, mínimo 2 caracteres
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      
      // EMAIL: requerido, formato de email válido
      email: ['', [Validators.required, Validators.email]],
      
      // ASUNTO: requerido (select dropdown)
      asunto: ['', [Validators.required]],
      
      // MENSAJE: requerido, mínimo 10 caracteres
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // ============================================================
  // GETTER PARA ACCEDER A LOS CONTROLES FÁCILMENTE
  // ============================================================
  // Permite usar f.nombre, f.email, etc. en el template
  get f(): any {
    return this.contactForm.controls;
  }

  // ============================================================
  // MÉTODO CANCELAR
  // ============================================================
  cancelar(): void {
    // No permitir cancelar si está procesando
    if (this.submitting) return;
    
    // Resetea el formulario (limpia todos los campos)
    this.contactForm.reset();
    
    // Limpia mensajes de feedback
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  // ============================================================
  // MÉTODO ENVIAR
  // ============================================================
  enviar(): void {
    // Limpiar mensajes previos
    this.mensajeExito = '';
    this.mensajeError = '';

    // Marca todos los campos como "tocados" para mostrar errores visuales
    this.contactForm.markAllAsTouched();

    // Si el formulario es inválido, no continuar
    if (this.contactForm.invalid) {
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // Activar estado de "enviando"
    this.submitting = true;

    // ============================================================
    // PREPARAR DATOS PARA ENVÍO
    // ============================================================
    // Limpiamos espacios en blanco y preparamos el payload
    const payload = {
      nombre: (this.f.nombre.value || '').toString().trim(),
      email: (this.f.email.value || '').toString().trim(),
      asunto: (this.f.asunto.value || '').toString().trim(),
      mensaje: (this.f.mensaje.value || '').toString().trim(),
      createdAt: new Date().toISOString()
    };

    try {
      // ============================================================
      // DESCARGAR COMO JSON (simulación de envío)
      // ============================================================
      // Convertimos el objeto a JSON con formato legible
      const text = JSON.stringify(payload, null, 2);
      
      // Creamos un Blob (archivo en memoria)
      const blob = new Blob([text], { type: 'application/json' });
      
      // Creamos una URL temporal para el Blob
      const url = window.URL.createObjectURL(blob);
      
      // Creamos un elemento <a> invisible para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contacto.json';
      
      // Agregamos al DOM, hacemos click y removemos
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Liberamos la URL temporal
      window.URL.revokeObjectURL(url);

      // ============================================================
      // ÉXITO: Limpiar formulario y mostrar mensaje
      // ============================================================
      this.mensajeExito = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto. ✨';
      this.contactForm.reset();

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.mensajeExito = '';
      }, 5000);

    } catch (err) {
      // ============================================================
      // ERROR: Mostrar mensaje de error
      // ============================================================
      console.error('Error al procesar el formulario:', err);
      this.mensajeError = 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.';
      
    } finally {
      // ============================================================
      // SIEMPRE: Desactivar estado de "enviando"
      // ============================================================
      this.submitting = false;
    }
  }
}