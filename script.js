/**
 * ========================================
 * PROMPTFORGE - FRAMEWORK DE ARQUITETURA DE PROMPTS
 * Versão: 2.0.0
 * Autor: PromptForge Team
 * ========================================
 */

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentPhase = 1;
let formData = {};
let currentRating = 0;

// ========================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE FASES
// ========================================

/**
 * Atualiza a barra de progresso
 */
function updateProgress() {
    const progress = (currentPhase - 1) * 25;
    document.getElementById('progressFill').style.width = progress + '%';
}

/**
 * Avança para a próxima fase
 * @param {number} phase - Número da fase de destino
 */
function nextPhase(phase) {
    // Validar dados da fase atual
    if (!validateCurrentPhase()) {
        return;
    }

    // Salvar dados da fase atual
    saveCurrentPhaseData();

    // Atualizar UI
    document.getElementById(`phase${currentPhase}`).classList.remove('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.remove('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.add('completed');

    currentPhase = phase;
    document.getElementById(`phase${currentPhase}`).classList.add('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.add('active');

    updateProgress();
}

/**
 * Retorna para a fase anterior
 * @param {number} phase - Número da fase de destino
 */
function prevPhase(phase) {
    document.getElementById(`phase${currentPhase}`).classList.remove('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.remove('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.add('pending');

    currentPhase = phase;
    document.getElementById(`phase${currentPhase}`).classList.add('active');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.remove('completed');
    document.querySelector(`[data-phase="${currentPhase}"]`).classList.add('active');

    updateProgress();
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================

/**
 * Valida os campos da fase atual
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateCurrentPhase() {
    switch (currentPhase) {
        case 1:
            const requestText = document.getElementById('requestText').value.trim();
            const domain = document.getElementById('domain').value;
            const complexity = document.getElementById('complexity').value;
            const userLevel = document.getElementById('userLevel').value;

            if (!requestText || !domain || !complexity || !userLevel) {
                showToast('⚠️ Por favor, preencha todos os campos obrigatórios da Fase 1.', 'warning');
                return false;
            }
            break;
        case 2:
            const outputFormat = document.getElementById('outputFormat').value;
            const tone = document.getElementById('tone').value;
            const length = document.getElementById('length').value;

            if (!outputFormat || !tone || !length) {
                showToast('⚠️ Por favor, preencha todos os campos obrigatórios da Fase 2.', 'warning');
                return false;
            }
            break;
        case 3:
            const successCriteria = document.getElementById('successCriteria').value.trim();
            if (!successCriteria) {
                showToast('⚠️ Por favor, defina os critérios de sucesso na Fase 3.', 'warning');
                return false;
            }
            break;
    }
    return true;
}

/**
 * Salva os dados da fase atual
 */
function saveCurrentPhaseData() {
    switch (currentPhase) {
        case 1:
            formData.requestText = document.getElementById('requestText').value;
            formData.domain = document.getElementById('domain').value;
            formData.complexity = document.getElementById('complexity').value;
            formData.userLevel = document.getElementById('userLevel').value;
            formData.context = document.getElementById('context').value;
            break;
        case 2:
            formData.outputFormat = document.getElementById('outputFormat').value;
            formData.tone = document.getElementById('tone').value;
            formData.length = document.getElementById('length').value;

            const techniques = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                techniques.push(cb.value);
            });
            formData.techniques = techniques;
            break;
        case 3:
            formData.successCriteria = document.getElementById('successCriteria').value;
            formData.restrictions = document.getElementById('restrictions').value;
            formData.examples = document.getElementById('examples').value;
            break;
    }
}

// ========================================
// GERAÇÃO DE PROMPTS
// ========================================

/**
 * Gera o prompt otimizado
 */
function generatePrompt() {
    if (!validateCurrentPhase()) return;
    saveCurrentPhaseData();

    // Mostrar loading
    document.getElementById('loadingSection').classList.add('show');
    showToast('🔄 Processando sua solicitação...', 'info');

    // Simular processamento
    setTimeout(() => {
        document.getElementById('loadingSection').classList.remove('show');

        // Gerar diagnóstico
        generateDiagnostic();

        // Gerar prompt otimizado
        const optimizedPrompt = createOptimizedPrompt();
        document.getElementById('optimizedPrompt').textContent = optimizedPrompt;

        // Gerar documentação
        generateDocumentation();

        // Gerar guia de personalização
        generateCustomizationGuide();

        // Gerar variações
        generateAlternativeVersions();

        // Gerar checklist
        generateValidationChecklist();

        // Mostrar resultados
        document.getElementById('resultsSection').classList.add('show');
        document.getElementById('feedbackSection').classList.add('show');

        // Atualizar fase
        nextPhase(4);

        // Feedback de sucesso
        showToast('🎉 Prompt gerado com sucesso!', 'success');
    }, 3000);
}

/**
 * Gera o diagnóstico da solicitação
 */
function generateDiagnostic() {
    const diagnosticHtml = `
        <div class="diagnostic-item">
            <h4>Domínio Identificado</h4>
            <p><strong>${getDomainLabel(formData.domain)}</strong></p>
            <p>Especialização detectada com base na solicitação fornecida.</p>
        </div>
        <div class="diagnostic-item">
            <h4>Nível de Complexidade</h4>
            <p><strong>${getComplexityLabel(formData.complexity)}</strong></p>
            <p>Requer abordagem ${formData.complexity} com técnicas específicas.</p>
        </div>
        <div class="diagnostic-item">
            <h4>Perfil do Usuário</h4>
            <p><strong>Nível ${getUserLevelLabel(formData.userLevel)}</strong></p>
            <p>Linguagem e profundidade ajustadas para este perfil.</p>
        </div>
        <div class="diagnostic-item">
            <h4>Técnicas Aplicadas</h4>
            <p><strong>${formData.techniques.length} técnicas selecionadas</strong></p>
            <p>${formData.techniques.join(', ')}</p>
        </div>
    `;
    document.getElementById('diagnosticResults').innerHTML = diagnosticHtml;
}

/**
 * Cria o prompt otimizado
 * @returns {string} - Prompt otimizado
 */
function createOptimizedPrompt() {
    const persona = getPersonaByDomain(formData.domain);
    const context = buildContext();
    const instructions = buildInstructions();
    const format = buildFormatInstructions();
    const examples = formData.examples ? `\n\nEXEMPLOS PRÁTICOS:\n${formData.examples}` : '';
    const constraints = formData.restrictions ? `\n\nRESTRIÇÕES E LIMITAÇÕES:\n${formData.restrictions}` : '';
    const enhancedTask = enhanceTaskDescription();

    return `🎯 PERSONA ESPECIALIZADA:
${persona}

📋 CONTEXTO OPERACIONAL:
${context}

⚡ METODOLOGIA DE EXECUÇÃO:
${instructions}

📊 ${format}

✅ CRITÉRIOS DE VALIDAÇÃO:
${formData.successCriteria}

🎯 OBJETIVO PRINCIPAL:
${enhancedTask}${examples}${constraints}

🚀 AÇÃO SOLICITADA:
Execute a tarefa seguindo rigorosamente todos os parâmetros acima, mantendo foco na qualidade, usabilidade e alinhamento com os objetivos especificados.`;
}

/**
 * Enriquece a descrição da tarefa com contexto específico
 * @returns {string} - Tarefa enriquecida
 */
function enhanceTaskDescription() {
    // Analisar e enriquecer a tarefa original com base no contexto
    let enhancedTask = formData.requestText;

    // Adicionar contexto específico baseado no domínio
    if (formData.domain === 'comercial' && formData.requestText.toLowerCase().includes('site')) {
        enhancedTask += `\n\n🎨 ESPECIFICAÇÕES TÉCNICAS ADICIONAIS:
- Interface responsiva (mobile-first)
- Sistema de carrinho de compras funcional
- Páginas de produto individuais com especificações detalhadas
- Sistema de busca e filtros
- Processo de checkout simplificado
- Integração com métodos de pagamento
- Painel administrativo para gestão de produtos
- Otimização SEO para mecanismos de busca`;
    }

    if (formData.context && formData.context.toLowerCase().includes('planeta')) {
        enhancedTask += `\n\n🌌 DIRETRIZES TEMÁTICAS:
- Design com tema espacial (cores escuras, elementos cósmicos)
- Informações científicas precisas sobre cada planeta
- Visualizações interativas ou imagens de alta qualidade
- Categorização por características (rochosos, gasosos, habitáveis)
- Comparativos entre planetas
- Dados técnicos: distância do Sol, período orbital, composição atmosférica
- Sistema de "favoritos" para planetas de interesse`;
    }

    return enhancedTask;
}

/**
 * Obtém a persona baseada no domínio
 * @param {string} domain - Domínio selecionado
 * @returns {string} - Descrição da persona
 */
function getPersonaByDomain(domain) {
    const personas = {
        'tecnico': 'Você é um Arquiteto de Software Sênior com 10+ anos de experiência em desenvolvimento full-stack e arquitetura de sistemas escaláveis. Sua expertise combina conhecimento profundo em tecnologias modernas com capacidade de criar soluções robustas e bem documentadas.',
        'criativo': 'Você é um Diretor Criativo e UX Designer com vasta experiência em campanhas premiadas, branding digital e design de interfaces. Sua visão combina inovação artística com usabilidade excepcional e resultados mensuráveis de negócio.',
        'analitico': 'Você é um Cientista de Dados Sênior especializado em transformar dados complexos em insights acionáveis e visualizações impactantes. Sua abordagem combina rigor analítico com comunicação clara de resultados e recomendações estratégicas.',
        'estrategico': 'Você é um Consultor Estratégico C-level com experiência comprovada em transformação digital e crescimento organizacional. Sua perspectiva integra visão de negócio holística com execução prática e mensuração de resultados.',
        'educacional': 'Você é um Designer Instrucional e Especialista em Experiência de Aprendizagem com expertise em pedagogia moderna e tecnologias educacionais. Sua abordagem personaliza o ensino para máximo engajamento e retenção de conhecimento.',
        'comercial': 'Você é um Growth Hacker e Especialista em E-commerce com track record comprovado em escalar negócios digitais do zero ao milhão. Sua estratégia combina métricas orientadas a dados, otimização de conversão e experiência excepcional do usuário.'
    };
    return personas[domain] || personas['tecnico'];
}

/**
 * Constrói o contexto operacional
 * @returns {string} - Contexto formatado
 */
function buildContext() {
    const contextParts = [
        `📊 Domínio: ${getDomainLabel(formData.domain)}`,
        `🔧 Nível de Complexidade: ${getComplexityLabel(formData.complexity)}`,
        `👤 Perfil do Usuário Final: ${getUserLevelLabel(formData.userLevel)}`,
        `🎨 Tom e Estilo: ${getToneLabel(formData.tone)}`,
        `📏 Extensão Esperada: ${getLengthLabel(formData.length)}`
    ];

    if (formData.context) {
        contextParts.push(`🌍 Contexto Específico: ${formData.context}`);
    }

    return contextParts.join('\n');
}

/**
 * Constrói as instruções de execução
 * @returns {string} - Instruções formatadas
 */
function buildInstructions() {
    const instructions = [];

    // Instruções baseadas nas técnicas selecionadas
    if (formData.techniques.includes('chain-of-thought')) {
        instructions.push('🧠 RACIOCÍNIO ESTRUTURADO: Demonstre seu processo de pensamento passo-a-passo');
    }
    if (formData.techniques.includes('few-shot')) {
        instructions.push('💡 EXEMPLOS PRÁTICOS: Forneça exemplos concretos para ilustrar cada conceito');
    }
    if (formData.techniques.includes('role-playing')) {
        instructions.push('🎭 CONSISTÊNCIA DE PERSONA: Mantenha o papel especializado durante toda a resposta');
    }
    if (formData.techniques.includes('step-by-step')) {
        instructions.push('📋 ESTRUTURA SEQUENCIAL: Organize a resposta em etapas claras e lógicas');
    }
    if (formData.techniques.includes('examples')) {
        instructions.push('🔍 APLICAÇÕES REAIS: Inclua casos de uso específicos e aplicáveis');
    }
    if (formData.techniques.includes('constraints')) {
        instructions.push('⚠️ LIMITAÇÕES: Respeite rigorosamente todas as restrições especificadas');
    }

    // Instruções gerais sempre presentes
    instructions.push(`🎯 QUALIDADE: Mantenha padrão ${getToneLabel(formData.tone).toLowerCase()} e profissional`);
    instructions.push(`📝 EXTENSÃO: Produza resposta ${getLengthLabel(formData.length).toLowerCase()} e bem estruturada`);

    // Instruções específicas por domínio
    const domainInstructions = {
        'tecnico': '💻 PRECISÃO TÉCNICA: Use terminologia correta e soluções testadas',
        'criativo': '🎨 INOVAÇÃO: Explore soluções originais e visualmente atrativas',
        'analitico': '📊 BASE DE DADOS: Fundamente decisões em análises e métricas',
        'estrategico': '🎯 VISÃO HOLÍSTICA: Consider impact a longo prazo e objetivos globais',
        'educacional': '📚 DIDÁTICA: Estruture para facilitar aprendizado e compreensão',
        'comercial': '💰 FOCO EM RESULTADOS: Priorize ROI, conversão e experiência do usuário'
    };

    if (domainInstructions[formData.domain]) {
        instructions.push(domainInstructions[formData.domain]);
    }

    return instructions.join('\n');
}

/**
 * Constrói as instruções de formato
 * @returns {string} - Instruções de formato
 */
function buildFormatInstructions() {
    const formatInstructions = {
        'texto': '📄 FORMATO: Texto bem estruturado com parágrafos organizados, títulos claros e transições suaves entre ideias.',
        'lista': '📋 FORMATO: Listas hierárquicas com tópicos, subtópicos e pontos de ação claros e objetivos.',
        'tabela': '📊 FORMATO: Tabelas organizadas com cabeçalhos descritivos, dados estruturados e comparações claras.',
        'json': '💾 FORMATO: JSON válido, bem formatado e documentado com estrutura lógica e campos autodescritivos.',
        'markdown': '📝 FORMATO: Markdown completo com cabeçalhos (H1-H6), listas, links, código e formatação apropriada.',
        'codigo': '💻 FORMATO: Código limpo, comentado, seguindo melhores práticas da linguagem com documentação inline.',
        'relatorio': '📑 FORMATO: Relatório executivo com sumário, desenvolvimento estruturado, conclusões e recomendações.'
    };

    return formatInstructions[formData.outputFormat] || formatInstructions['texto'];
}

// ========================================
// GERAÇÃO DE DOCUMENTAÇÃO
// ========================================

/**
 * Gera a documentação do processo
 */
function generateDocumentation() {
    const doc = `
        <h4>Decisões de Design Tomadas:</h4>
        <ul>
            <li><strong>Persona Selecionada:</strong> ${getPersonaByDomain(formData.domain).split('.')[0]} - Escolhida pela expertise no domínio ${getDomainLabel(formData.domain).toLowerCase()}</li>
            <li><strong>Técnicas Aplicadas:</strong> ${formData.techniques.join(', ') || 'Nenhuma específica'} - Selecionadas para otimizar a qualidade da resposta</li>
            <li><strong>Estrutura de Contexto:</strong> Inclui domínio, complexidade e perfil do usuário para direcionamento preciso</li>
            <li><strong>Formato de Saída:</strong> ${getFormatLabel(formData.outputFormat)} - Otimizado para o tipo de conteúdo solicitado</li>
        </ul>
        
        <h4>Justificativas Técnicas:</h4>
        <p>A estrutura do prompt foi otimizada considerando os princípios de clareza, especificidade e direcionamento contextual. 
        A persona escolhida estabelece autoridade e tom apropriado, enquanto as instruções detalhadas garantem consistência na execução.</p>
    `;
    document.getElementById('processDocumentation').innerHTML = doc;
}

/**
 * Gera o guia de personalização
 */
function generateCustomizationGuide() {
    const guide = `
        <h4>Como Personalizar Este Prompt:</h4>
        <ol>
            <li><strong>Ajustar Persona:</strong> Modifique a seção PERSONA para especialidades específicas do seu domínio</li>
            <li><strong>Contexto Específico:</strong> Adicione detalhes únicos do seu caso de uso na seção CONTEXTO</li>
            <li><strong>Critérios Personalizados:</strong> Adapte os CRITÉRIOS DE SUCESSO para suas métricas específicas</li>
            <li><strong>Exemplos Específicos:</strong> Inclua exemplos do seu domínio na seção EXEMPLOS</li>
        </ol>
        
        <h4>Variáveis Substituíveis:</h4>
        <ul>
            <li><code>[DOMÍNIO]</code> - Substitua por sua área específica</li>
            <li><code>[PÚBLICO]</code> - Ajuste para seu público-alvo</li>
            <li><code>[RESTRIÇÕES]</code> - Adicione limitações específicas</li>
        </ul>
    `;
    document.getElementById('customizationGuide').innerHTML = guide;
}

/**
 * Gera versões alternativas do prompt
 */
function generateAlternativeVersions() {
    const version1 = createOptimizedPrompt().replace('INSTRUÇÕES DETALHADAS:', 'DIRETRIZES ESPECÍFICAS:');
    const version2 = createOptimizedPrompt().replace('Você é um', 'Atue como um');

    const versions = `
        <h4>Versão Alternativa 1 - Foco em Diretrizes:</h4>
        <pre style="max-height: 200px; overflow-y: auto;">${version1.substring(0, 300)}...</pre>
        
        <h4>Versão Alternativa 2 - Abordagem de Role-Play:</h4>
        <pre style="max-height: 200px; overflow-y: auto;">${version2.substring(0, 300)}...</pre>
        
        <p><strong>Quando usar cada versão:</strong></p>
        <ul>
            <li><strong>Versão 1:</strong> Para tarefas que requerem seguimento rigoroso de diretrizes</li>
            <li><strong>Versão 2:</strong> Para interações mais conversacionais e criativas</li>
        </ul>
    `;
    document.getElementById('alternativeVersions').innerHTML = versions;
}

/**
 * Gera o checklist de validação
 */
function generateValidationChecklist() {
    const checklist = `
        <h4>Critérios de Validação:</h4>
        <div style="display: grid; gap: 10px;">
            <label><input type="checkbox"> A resposta mantém o tom ${getToneLabel(formData.tone).toLowerCase()} especificado</label>
            <label><input type="checkbox"> O formato de saída corresponde ao ${getFormatLabel(formData.outputFormat).toLowerCase()} solicitado</label>
            <label><input type="checkbox"> A extensão está adequada (${getLengthLabel(formData.length).toLowerCase()})</label>
            <label><input type="checkbox"> Os critérios de sucesso foram atendidos</label>
            <label><input type="checkbox"> As restrições foram respeitadas</label>
            <label><input type="checkbox"> O nível de complexidade é apropriado para ${getUserLevelLabel(formData.userLevel).toLowerCase()}</label>
            <label><input type="checkbox"> A persona se mantém consistente</label>
            <label><input type="checkbox"> As técnicas selecionadas foram aplicadas</label>
        </div>
        
        <h4 style="margin-top: 20px;">Métricas de Qualidade:</h4>
        <ul>
            <li><strong>Precisão:</strong> Elimina ambiguidades? ✓/✗</li>
            <li><strong>Completude:</strong> Aborda todas as dimensões? ✓/✗</li>
            <li><strong>Eficiência:</strong> Máximo resultado, mínimo esforço? ✓/✗</li>
            <li><strong>Escalabilidade:</strong> Permite adaptações futuras? ✓/✗</li>
        </ul>
    `;
    document.getElementById('validationChecklist').innerHTML = checklist;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Obtém o label do domínio
 * @param {string} domain - Domínio
 * @returns {string} - Label formatado
 */
function getDomainLabel(domain) {
    const labels = {
        'tecnico': 'Técnico',
        'criativo': 'Criativo',
        'analitico': 'Analítico',
        'estrategico': 'Estratégico',
        'educacional': 'Educacional',
        'comercial': 'Comercial'
    };
    return labels[domain] || domain;
}

/**
 * Obtém o label da complexidade
 * @param {string} complexity - Complexidade
 * @returns {string} - Label formatado
 */
function getComplexityLabel(complexity) {
    const labels = {
        'simples': 'Simples',
        'intermediaria': 'Intermediária',
        'complexa': 'Complexa',
        'especializada': 'Especializada'
    };
    return labels[complexity] || complexity;
}

/**
 * Obtém o label do nível do usuário
 * @param {string} level - Nível
 * @returns {string} - Label formatado
 */
function getUserLevelLabel(level) {
    const labels = {
        'iniciante': 'Iniciante',
        'intermediario': 'Intermediário',
        'avancado': 'Avançado',
        'especialista': 'Especialista'
    };
    return labels[level] || level;
}

/**
 * Obtém o label do tom
 * @param {string} tone - Tom
 * @returns {string} - Label formatado
 */
function getToneLabel(tone) {
    const labels = {
        'profissional': 'Profissional',
        'casual': 'Casual',
        'tecnico': 'Técnico',
        'criativo': 'Criativo',
        'educativo': 'Educativo',
        'persuasivo': 'Persuasivo'
    };
    return labels[tone] || tone;
}

/**
 * Obtém o label do formato
 * @param {string} format - Formato
 * @returns {string} - Label formatado
 */
function getFormatLabel(format) {
    const labels = {
        'texto': 'Texto corrido',
        'lista': 'Lista estruturada',
        'tabela': 'Tabela',
        'json': 'JSON',
        'markdown': 'Markdown',
        'codigo': 'Código',
        'relatorio': 'Relatório detalhado'
    };
    return labels[format] || format;
}

/**
 * Obtém o label da extensão
 * @param {string} length - Extensão
 * @returns {string} - Label formatado
 */
function getLengthLabel(length) {
    const labels = {
        'concisa': 'Concisa',
        'media': 'Média',
        'detalhada': 'Detalhada',
        'extensa': 'Extensa'
    };
    return labels[length] || length;
}

// ========================================
// FUNCIONALIDADES DE CLIPBOARD
// ========================================

/**
 * Copia texto para a área de transferência
 * @param {string} elementId - ID do elemento a ser copiado
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Elemento não encontrado:', elementId);
        showToast('❌ Erro: elemento não encontrado', 'error');
        return;
    }

    const text = element.textContent || element.innerText;

    if (!text || text.trim() === '') {
        showToast('⚠️ Nenhum conteúdo para copiar', 'warning');
        return;
    }

    // Método moderno (preferido)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Erro ao copiar (método moderno):', err);
            showToast('⚠️ Usando método alternativo de cópia...', 'info');
            fallbackCopyMethod(text);
        });
    } else {
        // Método fallback para compatibilidade
        showToast('ℹ️ Usando método alternativo de cópia...', 'info');
        fallbackCopyMethod(text);
    }
}

/**
 * Método fallback para cópia
 * @param {string} text - Texto a ser copiado
 */
function fallbackCopyMethod(text) {
    try {
        // Criar elemento temporário
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);

        // Selecionar e copiar
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999); // Para mobile

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            showCopySuccess();
        } else {
            throw new Error('Comando de cópia falhou');
        }
    } catch (err) {
        console.error('Erro no método fallback:', err);
        showToast('⚠️ Erro na cópia automática. Abrindo modal para cópia manual...', 'warning');
        // Último recurso - mostrar modal com texto para cópia manual
        showManualCopyModal(text);
    }
}

/**
 * Mostra sucesso na cópia
 */
function showCopySuccess() {
    // Encontrar o botão que foi clicado
    const buttons = document.querySelectorAll('button');
    let targetButton = null;

    buttons.forEach(btn => {
        if (btn.textContent.includes('Copiar') && !btn.textContent.includes('Copiado')) {
            targetButton = btn;
        }
    });

    if (targetButton) {
        const originalText = targetButton.textContent;
        const originalBg = targetButton.style.background;

        targetButton.textContent = '✅ Copiado!';
        targetButton.style.background = '#4CAF50';
        targetButton.style.transform = 'scale(0.95)';

        setTimeout(() => {
            targetButton.textContent = originalText;
            targetButton.style.background = originalBg;
            targetButton.style.transform = '';
        }, 2000);
    }

    // Mostrar notificação toast
    showToast('✅ Prompt copiado para área de transferência!', 'success');
}

/**
 * Mostra modal para cópia manual
 * @param {string} text - Texto a ser copiado
 */
function showManualCopyModal(text) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    content.innerHTML = `
        <h3 style="margin-top: 0; color: #667eea;">📋 Copiar Prompt Manualmente</h3>
        <p>Selecione todo o texto abaixo e copie (Ctrl+C ou Cmd+C):</p>
        <textarea readonly style="width: 100%; height: 200px; padding: 10px; border: 2px solid #667eea; border-radius: 8px; font-family: monospace; font-size: 12px;">${text}</textarea>
        <div style="text-align: right; margin-top: 15px;">
            <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Fechar</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Selecionar automaticamente o texto
    const textarea = content.querySelector('textarea');
    textarea.focus();
    textarea.select();
}

// ========================================
// SISTEMA DE NOTIFICAÇÕES
// ========================================

/**
 * Mostra notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação (success, warning, error, info)
 */
function showToast(message, type = 'success') {
    // Remover toast existente
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    // Definir cores baseadas no tipo
    const colors = {
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#F44336',
        'info': '#2196F3'
    };

    const bgColor = colors[type] || colors.success;

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        word-wrap: break-word;
    `;

    // Adicionar animação CSS
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    // Remover após 4 segundos para warnings e errors
    const duration = (type === 'warning' || type === 'error') ? 5000 : 3000;

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// ========================================
// SISTEMA DE FEEDBACK
// ========================================

/**
 * Submete o feedback do usuário
 */
function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    const rating = currentRating;

    if (rating === 0) {
        showToast('⚠️ Por favor, selecione uma avaliação.', 'warning');
        return;
    }

    // Simular envio de feedback
    showToast(`✅ Feedback enviado! Avaliação: ${rating}/5 estrelas.\nObrigado por contribuir para melhorar o PromptForge!`, 'success');

    // Reset feedback
    document.getElementById('feedbackText').value = '';
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    currentRating = 0;
}

/**
 * Inicia uma nova análise
 */
function startOver() {
    // Reset all data
    formData = {};
    currentRating = 0;
    currentPhase = 1;

    // Reset form fields
    document.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.type === 'checkbox') {
            field.checked = false;
        } else {
            field.value = '';
        }
    });

    // Reset UI
    document.querySelectorAll('.phase-content').forEach(phase => {
        phase.classList.remove('active');
    });
    document.querySelectorAll('.phase-step').forEach(step => {
        step.classList.remove('active', 'completed');
        step.classList.add('pending');
    });

    // Reset results
    document.getElementById('resultsSection').classList.remove('show');
    document.getElementById('feedbackSection').classList.remove('show');

    // Start from phase 1
    document.getElementById('phase1').classList.add('active');
    document.querySelector('[data-phase="1"]').classList.remove('pending');
    document.querySelector('[data-phase="1"]').classList.add('active');

    updateProgress();

    // Smooth scroll to top
    document.querySelector('.main-card').scrollIntoView({ behavior: 'smooth' });

    // Feedback visual
    showToast('🔄 Nova análise iniciada!', 'info');
}

// ========================================
// FUNÇÕES DE NAVEGAÇÃO SUAVE
// ========================================

/**
 * Navega suavemente para o topo
 */
function smoothScrollToTop() {
    document.querySelector('.phase-indicator').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ========================================
// VALIDAÇÃO EM TEMPO REAL
// ========================================

/**
 * Adiciona validação em tempo real para campos obrigatórios
 */
function addRealTimeValidation() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');

    requiredFields.forEach(field => {
        field.addEventListener('blur', function () {
            if (!this.value.trim()) {
                this.style.borderColor = '#F44336';
                this.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
            } else {
                this.style.borderColor = '#4CAF50';
                this.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
            }
        });

        field.addEventListener('input', function () {
            if (this.value.trim()) {
                this.style.borderColor = '#667eea';
                this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }
        });
    });
}

/**
 * Marca campos obrigatórios
 */
function markRequiredFields() {
    // Fase 1
    document.getElementById('requestText').setAttribute('required', 'required');
    document.getElementById('domain').setAttribute('required', 'required');
    document.getElementById('complexity').setAttribute('required', 'required');
    document.getElementById('userLevel').setAttribute('required', 'required');

    // Fase 2
    document.getElementById('outputFormat').setAttribute('required', 'required');
    document.getElementById('tone').setAttribute('required', 'required');
    document.getElementById('length').setAttribute('required', 'required');

    // Fase 3
    document.getElementById('successCriteria').setAttribute('required', 'required');
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Adiciona event listeners para o sistema de avaliação
 */
function addRatingListeners() {
    document.getElementById('ratingStars').addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            currentRating = rating;

            document.querySelectorAll('.star').forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    });
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function () {
    // Marcar campos obrigatórios
    markRequiredFields();

    // Adicionar validação em tempo real
    addRealTimeValidation();

    // Adicionar listeners para avaliação
    addRatingListeners();

    // Inicializar progresso
    updateProgress();
});

// ========================================
// FUNÇÕES DE NAVEGAÇÃO APRIMORADAS
// ========================================

// Enhance phase transitions with smooth scrolling
const originalNextPhase = nextPhase;
const originalPrevPhase = prevPhase;

nextPhase = function (phase) {
    originalNextPhase(phase);
    setTimeout(smoothScrollToTop, 100);
};

prevPhase = function (phase) {
    originalPrevPhase(phase);
    setTimeout(smoothScrollToTop, 100);
};
