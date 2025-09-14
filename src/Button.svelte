<script>
  /** @type {string} */
  export let variant = 'primary';
  
  /** @type {string} */
  export let size = 'medium';
  
  /** @type {boolean} */
  export let disabled = false;
  
  /** @type {string} */
  export let type = 'button';
  
  /** @type {string} */
  export let className = '';
  
  /** @type {Function} */
  export let onClick = () => {};
  
  /** @type {Function} */
  export let onKeydown = () => {};
  
  // Добавляем классы в зависимости от варианта и размера
  $: buttonClasses = `${className} btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`.trim();
</script>

<button 
  class={buttonClasses}
  type={type}
  disabled={disabled}
  on:click={onClick}
  on:keydown={onKeydown}
  {...$$restProps}
>
  <slot></slot>
</button>

<style>
  .btn {
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  /* Размеры */
  .btn-small {
    padding: 8px 16px;
    font-size: 0.875rem;
  }
  
  .btn-medium {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .btn-large {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
  
  /* Варианты */
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    color: white;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  .btn-primary:hover:not(.btn-disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-blue));
  }
  
  .btn-primary:active:not(.btn-disabled) {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .btn-secondary {
    background: linear-gradient(90deg, #6c757d, #495057);
    color: white;
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
  }
  
  .btn-secondary:hover:not(.btn-disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.5);
  }
  
  .btn-secondary:active:not(.btn-disabled) {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
  }
  
  .btn-danger {
    background: linear-gradient(90deg, #dc3545, #c82333);
    color: white;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  }
  
  .btn-danger:hover:not(.btn-disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.5);
  }
  
  .btn-danger:active:not(.btn-disabled) {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  }
  
  .btn-outline {
    background: transparent;
    color: var(--white);
    border: 2px solid var(--primary-pink);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .btn-outline:hover:not(.btn-disabled) {
    background: rgba(255, 20, 147, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  .btn-outline:active:not(.btn-disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* Состояние disabled */
  .btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Full width */
  .btn-full-width {
    width: 100%;
  }
</style>