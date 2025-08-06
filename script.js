document.addEventListener('DOMContentLoaded', function () {
    // =============================================
    // Efeito de Partículas
    // =============================================
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#9d7a5b"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#9d7a5b",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }

    // =============================================
    // Menu Hamburguer
    // =============================================
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.querySelector('body');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar fora
        body.addEventListener('click', function (e) {
            if (!e.target.closest('.menu') && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // =============================================
    // Funcionalidades para os campos de endereço
    // =============================================

    // Função para copiar endereço pessoal para entrega
    const sameAddressCheckbox = document.getElementById('same-address-checkbox');
    const deliveryAddressFields = document.getElementById('delivery-address-fields');

    if (sameAddressCheckbox && deliveryAddressFields) {
        sameAddressCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Desabilitar todos os campos de entrega
                const inputs = deliveryAddressFields.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.value = '';
                });
            } else {
                // Habilitar todos os campos de entrega
                const inputs = deliveryAddressFields.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.disabled = false;
                });
            }
        });
    }

    // Função para lidar com a checkbox "Sem número"
    function setupNoNumberCheckboxes() {
        document.querySelectorAll('.no-number-checkbox').forEach(checkbox => {
            const numberInput = checkbox.closest('.number-container').querySelector('.number-input');

            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    numberInput.value = 'S/N';
                    numberInput.disabled = true;
                } else {
                    numberInput.value = '';
                    numberInput.disabled = false;
                }
            });

            // Verificar se o campo número já está preenchido com "S/N" ao carregar
            if (numberInput.value === 'S/N') {
                checkbox.checked = true;
                numberInput.disabled = true;
            }
        });
    }

    setupNoNumberCheckboxes();

    // Função para máscara de CEP
    function applyCepMasks() {
        document.querySelectorAll('.cep-input').forEach(cepInput => {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) {
                    value = value.substring(0, 8);
                }

                if (value.length > 5) {
                    value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
                }

                e.target.value = value;
            });

            // Buscar endereço via API quando o CEP tiver 8 dígitos
            cepInput.addEventListener('blur', function() {
                const cep = this.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.erro) {
                                // Determinar se é o CEP pessoal ou de entrega
                                const isPersonal = this.name.includes('Pessoal');
                                const prefix = isPersonal ? 'Pessoal' : 'Entrega';

                                // Preencher os campos correspondentes
                                const form = this.closest('form');
                                if (form) {
                                    if (data.logradouro) {
                                        const streetType = form.querySelector(`select[name="Tipo Logradouro ${prefix}"]`);
                                        const streetName = form.querySelector(`input[name="Logradouro ${prefix}"]`);

                                        // Extrair tipo de logradouro (Rua, Avenida, etc.)
                                        const streetParts = data.logradouro.split(' ');
                                        if (streetParts.length > 1) {
                                            const possibleTypes = ['Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Rodovia', 'Viela', 'Estrada'];
                                            const firstWord = streetParts[0];

                                            if (possibleTypes.includes(firstWord)) {
                                                streetType.value = firstWord;
                                                streetName.value = streetParts.slice(1).join(' ');
                                            } else {
                                                streetType.value = 'Rua'; // Default
                                                streetName.value = data.logradouro;
                                            }
                                        } else {
                                            streetType.value = 'Rua'; // Default
                                            streetName.value = data.logradouro;
                                        }
                                    }

                                    if (data.bairro) {
                                        form.querySelector(`input[name="Bairro ${prefix}"]`).value = data.bairro;
                                    }

                                    if (data.localidade) {
                                        form.querySelector(`input[name="Cidade ${prefix}"]`).value = data.localidade;
                                    }

                                    if (data.uf) {
                                        form.querySelector(`input[name="Estado ${prefix}"]`).value = data.uf;
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar CEP:', error);
                        });
                }
            });
        });
    }

    applyCepMasks();

    // =============================================
    // Validação de Campos do Formulário
    // =============================================
    const clientForm = document.querySelector('form');
    const clientType = document.querySelector('select[name="Tipo de Cliente"]');
    const documentField = document.querySelector('input[name="CPF/CNPJ"]');
    const fullNameField = document.querySelector('input[name="Nome Completo"]');
    const birthDateField = document.querySelector('input[name="Data de Nascimento"]');
    const phoneField = document.querySelector('input[name="Telefone"]');
    const emailField = document.querySelector('input[name="email"]');

    // =============================================
    // Máscaras e Validações Específicas
    // =============================================

    // Função para validar CPF
    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Função para validar CNPJ
    function validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

        let length = cnpj.length - 2;
        let numbers = cnpj.substring(0, length);
        const digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }

    // Função para validar e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função para aplicar máscara e validação de telefone
    function applyPhoneMaskAndValidation() {
        if (phoneField) {
            phoneField.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                const maxLength = parseInt(this.dataset.maxLength) || 11;

                // Limitar ao máximo de caracteres
                if (value.length > maxLength) {
                    value = value.substring(0, maxLength);
                }

                // Aplicar máscara conforme o comprimento
                if (maxLength > 10) {
                    // Formato brasileiro: (XX) XXXXX-XXXX
                    if (value.length > 10) {
                        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                    } else if (value.length > 6) {
                        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                    } else if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
                    } else {
                        value = value.replace(/^(\d{0,2}).*/, '($1');
                    }
                } else {
                    // Formato internacional menor: (XX) XXXX-XXXX
                    if (value.length > 6) {
                        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                    } else if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d{0,4}).*/, '($1) $2');
                    } else {
                        value = value.replace(/^(\d{0,2}).*/, '($1');
                    }
                }

                e.target.value = value;
            });

            // Validar comprimento ao sair do campo
            phoneField.addEventListener('blur', function() {
                const numericValue = this.value.replace(/\D/g, '');
                const maxLength = parseInt(this.dataset.maxLength) || 11;
                const minLength = Math.min(8, maxLength);

                if (numericValue.length < minLength) {
                    this.style.borderColor = 'var(--error-color)';
                    this.classList.add('animate__animated', 'animate__headShake');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__headShake');
                    }, 1000);
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }

    // Função para aplicar máscara e validação de CPF/CNPJ
    function applyDocumentMaskAndValidation() {
        if (documentField) {
            documentField.addEventListener('input', function (e) {
                let value = e.target.value;
                const type = clientType ? clientType.value : 'Pessoa Física';
                let numericValue = value.replace(/\D/g, '');

                if (type === 'Pessoa Física') {
                    // CPF: 000.000.000-00 (11 dígitos)
                    if (numericValue.length > 11) {
                        numericValue = numericValue.substring(0, 11);
                    }

                    if (numericValue.length > 9) {
                        value = numericValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
                    } else if (numericValue.length > 6) {
                        value = numericValue.replace(/^(\d{3})(\d{3})(\d{0,3})$/, '$1.$2.$3');
                    } else if (numericValue.length > 3) {
                        value = numericValue.replace(/^(\d{3})(\d{0,3})$/, '$1.$2');
                    } else {
                        value = numericValue;
                    }
                } else {
                    // CNPJ: 00.000.000/0000-00 (14 dígitos)
                    if (numericValue.length > 14) {
                        numericValue = numericValue.substring(0, 14);
                    }

                    if (numericValue.length > 12) {
                        value = numericValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
                    } else if (numericValue.length > 8) {
                        value = numericValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, '$1.$2.$3/$4');
                    } else if (numericValue.length > 5) {
                        value = numericValue.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2.$3');
                    } else if (numericValue.length > 2) {
                        value = numericValue.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
                    } else {
                        value = numericValue;
                    }
                }

                e.target.value = value;
            });

            // Validação ao sair do campo
            documentField.addEventListener('blur', function() {
                const type = clientType ? clientType.value : 'Pessoa Física';
                const docValue = this.value.replace(/\D/g, '');

                if (type === 'Pessoa Física') {
                    if (docValue.length !== 11 || !validateCPF(this.value)) {
                        this.style.borderColor = 'var(--error-color)';
                        this.classList.add('animate__animated', 'animate__headShake');
                        setTimeout(() => {
                            this.classList.remove('animate__animated', 'animate__headShake');
                        }, 1000);
                    } else {
                        this.style.borderColor = '';
                    }
                } else {
                    if (docValue.length !== 14 || !validateCNPJ(this.value)) {
                        this.style.borderColor = 'var(--error-color)';
                        this.classList.add('animate__animated', 'animate__headShake');
                        setTimeout(() => {
                            this.classList.remove('animate__animated', 'animate__headShake');
                        }, 1000);
                    } else {
                        this.style.borderColor = '';
                    }
                }
            });
        }
    }

    // Função para validar nome completo
    function applyNameValidation() {
        if (fullNameField) {
            fullNameField.addEventListener('blur', function() {
                const nameValue = this.value.trim();
                if (nameValue.length < 5 || !nameValue.includes(' ')) {
                    this.style.borderColor = 'var(--error-color)';
                    this.classList.add('animate__animated', 'animate__headShake');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__headShake');
                    }, 1000);
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }

    // Função para validar e-mail
    function applyEmailValidation() {
        if (emailField) {
            emailField.addEventListener('blur', function() {
                if (!validateEmail(this.value)) {
                    this.style.borderColor = 'var(--error-color)';
                    this.classList.add('animate__animated', 'animate__headShake');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__headShake');
                    }, 1000);
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }

    // Função para validar data de nascimento
    function applyBirthDateValidation() {
        if (birthDateField) {
            birthDateField.addEventListener('blur', function() {
                const today = new Date();
                const birthDate = new Date(this.value);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18 || !this.value) {
                    this.style.borderColor = 'var(--error-color)';
                    this.classList.add('animate__animated', 'animate__headShake');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__headShake');
                    }, 1000);
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }

    // Alternar entre CPF e CNPJ
    if (clientType) {
        clientType.addEventListener('change', function () {
            const documentLabel = document.querySelector('label[for="document"]');

            if (this.value === 'Pessoa Física') {
                if (documentLabel) documentLabel.textContent = 'CPF *';
                if (documentField) {
                    documentField.placeholder = '000.000.000-00';
                    documentField.maxLength = 14; // Com máscara
                }
            } else {
                if (documentLabel) documentLabel.textContent = 'CNPJ *';
                if (documentField) {
                    documentField.placeholder = '00.000.000/0000-00';
                    documentField.maxLength = 18; // Com máscara
                }
            }

            if (documentField) documentField.value = '';
        });
    }

    // Configurar máscaras e validações iniciais
    applyPhoneMaskAndValidation();
    applyDocumentMaskAndValidation();
    applyNameValidation();
    applyEmailValidation();
    applyBirthDateValidation();

    // Configurar Brasil como padrão para telefone
    if (phoneField) {
        phoneField.dataset.maxLength = 11;
        phoneField.placeholder = '(XX) XXXXX-XXXX';
    }

    // =============================================
    // Validação do Formulário
    // =============================================
    if (clientForm) {
        clientForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            // Validação dos campos obrigatórios
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error-color)';
                    isValid = false;

                    // Efeito de animação para campos inválidos
                    field.classList.add('animate__animated', 'animate__headShake');
                    setTimeout(() => {
                        field.classList.remove('animate__animated', 'animate__headShake');
                    }, 1000);
                } else {
                    field.style.borderColor = '';
                }
            });

            // Validação específica para CPF/CNPJ
            if (documentField) {
                const docValue = documentField.value.replace(/\D/g, '');
                const type = clientType ? clientType.value : 'Pessoa Física';

                if (type === 'Pessoa Física') {
                    if (docValue.length !== 11 || !validateCPF(documentField.value)) {
                        alert('Por favor, insira um CPF válido');
                        documentField.style.borderColor = 'var(--error-color)';
                        isValid = false;
                    }
                } else if (type === 'Pessoa Jurídica') {
                    if (docValue.length !== 14 || !validateCNPJ(documentField.value)) {
                        alert('Por favor, insira um CNPJ válido');
                        documentField.style.borderColor = 'var(--error-color)';
                        isValid = false;
                    }
                }
            }

            // Validação do telefone
            if (phoneField) {
                const phoneValue = phoneField.value.replace(/\D/g, '');
                const maxLength = parseInt(phoneField.dataset.maxLength) || 11;
                const minLength = Math.min(8, maxLength);

                if (phoneValue.length < minLength) {
                    alert('Por favor, insira um número de telefone válido');
                    phoneField.style.borderColor = 'var(--error-color)';
                    isValid = false;
                }
            }

            // Validação do e-mail
            if (emailField && !validateEmail(emailField.value)) {
                alert('Por favor, insira um e-mail válido');
                emailField.style.borderColor = 'var(--error-color)';
                isValid = false;
            }

            // Validação do nome completo
            if (fullNameField && (fullNameField.value.length < 5 || !fullNameField.value.includes(' '))) {
                alert('Por favor, insira seu nome completo');
                fullNameField.style.borderColor = 'var(--error-color)';
                isValid = false;
            }

            // Validação dos endereços
            const validateAddress = (prefix) => {
                const cep = document.querySelector(`input[name="CEP ${prefix}"]`).value.replace(/\D/g, '');
                const streetType = document.querySelector(`select[name="Tipo Logradouro ${prefix}"]`).value;
                const streetName = document.querySelector(`input[name="Logradouro ${prefix}"]`).value;
                const number = document.querySelector(`input[name="Número ${prefix}"]`).value;
                const neighborhood = document.querySelector(`input[name="Bairro ${prefix}"]`).value;
                const city = document.querySelector(`input[name="Cidade ${prefix}"]`).value;
                const state = document.querySelector(`input[name="Estado ${prefix}"]`).value;

                if (prefix === 'Pessoal') {
                    if (cep.length !== 8) {
                        alert('Por favor, insira um CEP pessoal válido');
                        document.querySelector(`input[name="CEP ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!streetType) {
                        alert('Por favor, selecione o tipo de logradouro pessoal');
                        document.querySelector(`select[name="Tipo Logradouro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!streetName) {
                        alert('Por favor, insira o nome do logradouro pessoal');
                        document.querySelector(`input[name="Logradouro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!number && !document.querySelector(`input[name="Sem Número ${prefix}"]`).checked) {
                        alert('Por favor, insira o número do endereço pessoal ou marque "Sem número"');
                        document.querySelector(`input[name="Número ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!neighborhood) {
                        alert('Por favor, insira o bairro pessoal');
                        document.querySelector(`input[name="Bairro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!city) {
                        alert('Por favor, insira a cidade pessoal');
                        document.querySelector(`input[name="Cidade ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }

                    if (!state) {
                        alert('Por favor, insira o estado pessoal');
                        document.querySelector(`input[name="Estado ${prefix}"]`).style.borderColor = 'var(--error-color)';
                        return false;
                    }
                } else {
                    // Validação para endereço de entrega (só se não estiver marcado como mesmo endereço)
                    if (!sameAddressCheckbox.checked) {
                        if (cep && cep.length !== 8) {
                            alert('Por favor, insira um CEP de entrega válido ou deixe em branco');
                            document.querySelector(`input[name="CEP ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (streetName && !streetType) {
                            alert('Por favor, selecione o tipo de logradouro de entrega');
                            document.querySelector(`select[name="Tipo Logradouro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (streetType && !streetName) {
                            alert('Por favor, insira o nome do logradouro de entrega');
                            document.querySelector(`input[name="Logradouro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (number === '' && !document.querySelector(`input[name="Sem Número ${prefix}"]`).checked && streetName) {
                            alert('Por favor, insira o número do endereço de entrega ou marque "Sem número"');
                            document.querySelector(`input[name="Número ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (streetName && !neighborhood) {
                            alert('Por favor, insira o bairro de entrega');
                            document.querySelector(`input[name="Bairro ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (streetName && !city) {
                            alert('Por favor, insira a cidade de entrega');
                            document.querySelector(`input[name="Cidade ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }

                        if (streetName && !state) {
                            alert('Por favor, insira o estado de entrega');
                            document.querySelector(`input[name="Estado ${prefix}"]`).style.borderColor = 'var(--error-color)';
                            return false;
                        }
                    }
                }

                return true;
            };

            // Validar endereço pessoal
            if (!validateAddress('Pessoal')) {
                isValid = false;
            }

            // Validar endereço de entrega apenas se não for o mesmo
            if (!sameAddressCheckbox.checked && !validateAddress('Entrega')) {
                isValid = false;
            }

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                // Simular envio (substituir por envio real)
                setTimeout(() => {
                    // Efeito de confetti para sucesso
                    if (window.confetti) {
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }

                    // Mensagem de sucesso
                    alert('Cadastro enviado com sucesso! Em breve entraremos em contato.');

                    // Resetar formulário
                    this.reset();

                    // Restaurar botão
                    submitBtn.innerHTML = 'Finalizar Cadastro';
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // =============================================
    // Animação da Linha do Menu
    // =============================================
    const navLinksMenu = document.querySelectorAll('.nav-link');
    const menuLine = document.querySelector('.menu-line');

    function updateMenuLine() {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink && menuLine) {
            const linkRect = activeLink.getBoundingClientRect();
            const menuRect = document.querySelector('.menu').getBoundingClientRect();

            menuLine.style.width = `${linkRect.width}px`;
            menuLine.style.left = `${linkRect.left - menuRect.left}px`;
            menuLine.style.opacity = '1';
        } else if (menuLine) {
            menuLine.style.opacity = '0';
        }
    }

    if (navLinksMenu.length && menuLine) {
        navLinksMenu.forEach(link => {
            link.addEventListener('mouseenter', function () {
                const linkRect = this.getBoundingClientRect();
                const menuRect = document.querySelector('.menu').getBoundingClientRect();

                menuLine.style.width = `${linkRect.width}px`;
                menuLine.style.left = `${linkRect.left - menuRect.left}px`;
                menuLine.style.opacity = '1';
            });

            link.addEventListener('mouseleave', updateMenuLine);

            link.addEventListener('click', function () {
                navLinksMenu.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                updateMenuLine();
            });
        });

        // Inicializar posição da linha
        updateMenuLine();
        window.addEventListener('resize', updateMenuLine);
    }

    // =============================================
    // Scroll Suave para Âncoras
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });

                // Atualizar URL sem recarregar a página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // =============================================
    // Animação ao Rolar a Página
    // =============================================
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-animate]');
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;

            if (elementBottom >= windowTop && elementTop <= windowBottom) {
                element.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // =============================================
    // Instagram Float Button
    // =============================================
    const instagramFloat = document.createElement('a');
    instagramFloat.href = 'https://www.instagram.com/gr_beauty_distribuidora';
    instagramFloat.target = '_blank';
    instagramFloat.className = 'instagram-float';
    instagramFloat.innerHTML = '<i class="fab fa-instagram"></i>';
    document.body.appendChild(instagramFloat);

    // Mostrar/ocultar ao rolar
    function toggleInstagramButton() {
        if (window.scrollY > 300) {
            instagramFloat.classList.add('visible');
        } else {
            instagramFloat.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleInstagramButton);
    toggleInstagramButton(); // Verificar estado inicial

    // Carregar confetti.js se não estiver disponível
    if (!window.confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        document.body.appendChild(script);
    }
});
