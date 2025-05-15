// Menú desplegable
        const menuButton = document.getElementById('menuButton');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        menuButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });

        // Manejo de subida de archivos
        document.querySelectorAll('.file-upload').forEach(uploadArea => {
            const fileInput = uploadArea.querySelector('input[type="file"]');
            const fileNameDisplay = document.getElementById(fileInput.id + 'Name');

            // Click en el área
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Cambio al seleccionar archivo
            fileInput.addEventListener('change', (e) => {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    if (file.size > 5 * 1024 * 1024) {
                        alert('El archivo es demasiado grande. Máximo 5MB permitidos.');
                        fileInput.value = '';
                        return;
                    }
                    
                    fileNameDisplay.textContent = `Archivo seleccionado: ${file.name}`;
                    fileNameDisplay.classList.remove('hidden');
                    uploadArea.classList.add('bg-blue-50', 'border-blue-300');
                }
            });

            // Efectos drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-blue-400', 'bg-blue-50');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            });
        });

        // Manejo del formulario
        document.getElementById('documentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar que se hayan subido archivos
            const fileInputs = document.querySelectorAll('input[type="file"]');
            let filesUploaded = false;
            
            fileInputs.forEach(input => {
                if (input.files.length > 0) {
                    filesUploaded = true;
                }
            });
            
            if (!filesUploaded) {
                alert('Por favor, sube al menos un documento.');
                return;
            }
            
            // Simular envío (en un caso real sería una petición AJAX)
            alert('Documentos enviados correctamente. Nos pondremos en contacto contigo pronto.');
            
            // Mostrar documentos subidos
            const uploadedDiv = document.getElementById('uploadedDocuments');
            uploadedDiv.innerHTML = '';
            
            fileInputs.forEach(input => {
                if (input.files.length > 0) {
                    const file = input.files[0];
                    const docElement = document.createElement('div');
                    docElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded border';
                    docElement.innerHTML = `
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>${file.name}</span>
                        </div>
                        <span class="text-green-500 text-sm">Subido correctamente</span>
                    `;
                    uploadedDiv.appendChild(docElement);
                }
            });
        });