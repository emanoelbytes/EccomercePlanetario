/**
 * ========================================
 * PROMPTFORGE PRO - FRAMEWORK PROFISSIONAL DE ARQUITETURA DE PROMPTS
 * Versão: 3.0.0 - CORRIGIDA E COMPLETA
 * Autor: PromptForge Pro Team
 * ========================================
 */

// ========================================
// CONFIGURAÇÕES GLOBAIS
// ========================================
const CONFIG = {
    VERSION: '3.0.0',
    MAX_PHASES: 4,
    VALIDATION_TIMEOUT: 500,
    GENERATION_TIMEOUT: 3000,
    AUTO_SAVE_INTERVAL: 30000
};

// ========================================
// ESTADO GLOBAL DA APLICAÇÃO
// ========================================
let currentPhase = 1;
let formData = {};
let currentRating = 0;
let appState = {
    currentPhase: 1,
    formData: {},
    validationResults: {},
    qualityMetrics: {
        clarityScore: 0,
        specificityScore: 0,
        completenessScore: 0,
        technicalAccuracy: 0,
        overallRating: 0
    }
};

// ========================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE FASES
// ========================================

function updateProgress() {
    const progress = (currentPhase - 1) * 25;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

function nextPhase(phase) {
    if (!validateCurrentPhase()) {
        return;
    }

    saveCurrentPhaseData();

    // Atualizar UI
    const currentPhaseElement = document.getElementById(`phase${currentPhase}`);
    const currentPhaseStep = document.querySelector(`[data-phase="${currentPhase}"]`);

    if (currentPhaseElement && currentPhaseStep) {
        currentPhaseElement.classList.remove('active');
        currentPhaseStep.classList.remove('active');
        currentPhaseStep.classList.add('completed');
    }

    currentPhase = phase;
    appState.currentPhase = phase;

    const newPhaseElement = document.getElementById(`phase${currentPhase}`);
    const newPhaseStep = document.querySelector(`[data-phase="${currentPhase}"]`);

    if (newPhaseElement && newPhaseStep) {
        newPhaseElement.classList.add('active');
        newPhaseStep.classList.add('active');
    }

    updateProgress();
    smoothScrollToTop();
}

function prevPhase(phase) {
    const currentPhaseElement = document.getElementById(`phase${currentPhase}`);
    const currentPhaseStep = document.querySelector(`[data-phase="${currentPhase}"]`);

    if (currentPhaseElement && currentPhaseStep) {
        currentPhaseElement.classList.remove('active');
        currentPhaseStep.classList.remove('active');
        currentPhaseStep.classList.add('pending');
    }

    currentPhase = phase;
    appState.currentPhase = phase;

    const newPhaseElement = document.getElementById(`phase${currentPhase}`);
    const newPhaseStep = document.querySelector(`[data-phase="${currentPhase}"]`);

    if (newPhaseElement && newPhaseStep) {
        newPhaseElement.classList.add('active');
        newPhaseStep.classList.remove('completed');
        newPhaseStep.classList.add('active');
    }

    updateProgress();
    smoothScrollToTop();
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================

function validateCurrentPhase() {
    switch (currentPhase) {
        case 1:
            const requestText = document.getElementById('requestText')?.value?.trim();
            const domain = document.getElementById('domain')?.value;
            const complexity = document.getElementById('complexity')?.value;
            const userLevel = document.getElementById('userLevel')?.value;

            if (!requestText || !domain || !complexity || !userLevel) {
                showToast('⚠️ Por favor, preencha todos os campos obrigatórios da Fase 1.', 'warning');
                return false;
            }

            if (requestText.length < 20) {
                showToast('⚠️ A descrição deve ter pelo menos 20 caracteres.', 'warning');
                return false;
            }
            break;

        case 2:
            const outputFormat = document.getElementById('outputFormat')?.value;
            const tone = document.getElementById('tone')?.value;
            const length = document.getElementById('length')?.value;

            if (!outputFormat || !tone || !length) {
                showToast('⚠️ Por favor, preencha todos os campos obrigatórios da Fase 2.', 'warning');
                return false;
            }
            break;

        case 3:
            const successCriteria = document.getElementById('successCriteria')?.value?.trim();
            if (!successCriteria) {
                showToast('⚠️ Por favor, defina os critérios de sucesso na Fase 3.', 'warning');
                return false;
            }

            if (successCriteria.length < 30) {
                showToast('⚠️ Os critérios de sucesso devem ser mais detalhados.', 'warning');
                return false;
            }
            break;
    }
    return true;
}

function saveCurrentPhaseData() {
    switch (currentPhase) {
        case 1:
            formData.requestText = document.getElementById('requestText')?.value || '';
            formData.domain = document.getElementById('domain')?.value || '';
            formData.complexity = document.getElementById('complexity')?.value || '';
            formData.userLevel = document.getElementById('userLevel')?.value || '';
            formData.context = document.getElementById('context')?.value || '';
            break;

        case 2:
            formData.outputFormat = document.getElementById('outputFormat')?.value || '';
            formData.tone = document.getElementById('tone')?.value || '';
            formData.length = document.getElementById('length')?.value || '';

            const techniques = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                techniques.push(cb.value);
            });
            formData.techniques = techniques;
            break;

        case 3:
            formData.successCriteria = document.getElementById('successCriteria')?.value || '';
            formData.restrictions = document.getElementById('restrictions')?.value || '';
            formData.examples = document.getElementById('examples')?.value || '';
            break;
    }

    // Salvar no estado global
    appState.formData[`phase${currentPhase}`] = { ...formData };

    // Auto-salvamento
    saveToLocalStorage();
}

// ========================================
// GERAÇÃO DE PROMPTS
// ========================================

function generatePrompt() {
    if (!validateCurrentPhase()) return;

    saveCurrentPhaseData();

    // Mostrar loading
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) {
        loadingSection.classList.add('show');
    }

    showToast('🔄 Processando sua solicitação...', 'info');

    // Simular processamento
    setTimeout(() => {
        if (loadingSection) {
            loadingSection.classList.remove('show');
        }

        // Gerar diagnóstico
        generateDiagnostic();

        // Gerar prompt otimizado
        const optimizedPrompt = createOptimizedPrompt();
        const optimizedPromptElement = document.getElementById('optimizedPrompt');
        if (optimizedPromptElement) {
            optimizedPromptElement.textContent = optimizedPrompt;
        }

        // Gerar documentação
        generateDocumentation();

        // Gerar guia de personalização
        generateCustomizationGuide();

        // Gerar variações
        generateAlternativeVersions();

        // Gerar checklist
        generateValidationChecklist();

        // Mostrar resultados
        const resultsSection = document.getElementById('resultsSection');
        const feedbackSection = document.getElementById('feedbackSection');

        if (resultsSection) resultsSection.classList.add('show');
        if (feedbackSection) feedbackSection.classList.add('show');

        // Atualizar fase
        nextPhase(4);

        // Feedback de sucesso
        showToast('🎉 Prompt gerado com sucesso!', 'success');
    }, CONFIG.GENERATION_TIMEOUT);
}

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
            <p><strong>${formData.techniques?.length || 0} técnicas selecionadas</strong></p>
            <p>${formData.techniques?.join(', ') || 'Nenhuma técnica específica'}</p>
        </div>
    `;

    const diagnosticResults = document.getElementById('diagnosticResults');
    if (diagnosticResults) {
        diagnosticResults.innerHTML = diagnosticHtml;
    }
}

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

function enhanceTaskDescription() {
    let enhancedTask = formData.requestText || '';

    // Adicionar contexto específico baseado no domínio
    if (formData.domain === 'comercial' && formData.requestText?.toLowerCase().includes('site')) {
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

function buildInstructions() {
    const instructions = [];

    // Instruções baseadas nas técnicas selecionadas
    if (formData.techniques?.includes('chain-of-thought')) {
        instructions.push('🧠 RACIOCÍNIO ESTRUTURADO: Demonstre seu processo de pensamento passo-a-passo');
    }
    if (formData.techniques?.includes('few-shot')) {
        instructions.push('💡 EXEMPLOS PRÁTICOS: Forneça exemplos concretos para ilustrar cada conceito');
    }
    if (formData.techniques?.includes('role-playing')) {
        instructions.push('🎭 CONSISTÊNCIA DE PERSONA: Mantenha o papel especializado durante toda a resposta');
    }
    if (formData.techniques?.includes('step-by-step')) {
        instructions.push('📋 ESTRUTURA SEQUENCIAL: Organize a resposta em etapas claras e lógicas');
    }
    if (formData.techniques?.includes('examples')) {
        instructions.push('🔍 APLICAÇÕES REAIS: Inclua casos de uso específicos e aplicáveis');
    }
    if (formData.techniques?.includes('constraints')) {
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
        'estrategico': '🎯 VISÃO HOLÍSTICA: Considere impacto a longo prazo e objetivos globais',
        'educacional': '📚 DIDÁTICA: Estruture para facilitar aprendizado e compreensão',
        'comercial': '💰 FOCO EM RESULTADOS: Priorize ROI, conversão e experiência do usuário'
    };

    if (domainInstructions[formData.domain]) {
        instructions.push(domainInstructions[formData.domain]);
    }

    return instructions.join('\n');
}

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

function generateDocumentation() {
    const doc = `
        <h4>Decisões de Design Tomadas:</h4>
        <ul>
            <li><strong>Persona Selecionada:</strong> ${getPersonaByDomain(formData.domain).split('.')[0]} - Escolhida pela expertise no domínio ${getDomainLabel(formData.domain).toLowerCase()}</li>
            <li><strong>Técnicas Aplicadas:</strong> ${formData.techniques?.join(', ') || 'Nenhuma específica'} - Selecionadas para otimizar a qualidade da resposta</li>
            <li><strong>Estrutura de Contexto:</strong> Inclui domínio, complexidade e perfil do usuário para direcionamento preciso</li>
            <li><strong>Formato de Saída:</strong> ${getFormatLabel(formData.outputFormat)} - Otimizado para o tipo de conteúdo solicitado</li>
        </ul>
        
        <h4>Justificativas Técnicas:</h4>
        <p>A estrutura do prompt foi otimizada considerando os princípios de clareza, especificidade e direcionamento contextual. 
        A persona escolhida estabelece autoridade e tom apropriado, enquanto as instruções detalhadas garantem consistência na execução.</p>
    `;

    const processDocumentation = document.getElementById('processDocumentation');
    if (processDocumentation) {
        processDocumentation.innerHTML = doc;
    }
}

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

    const customizationGuide = document.getElementById('customizationGuide');
    if (customizationGuide) {
        customizationGuide.innerHTML = guide;
    }
}

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

    const alternativeVersions = document.getElementById('alternativeVersions');
    if (alternativeVersions) {
        alternativeVersions.innerHTML = versions;
    }
}

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

    const validationChecklist = document.getElementById('validationChecklist');
    if (validationChecklist) {
        validationChecklist.innerHTML = checklist;
    }
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

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

function getComplexityLabel(complexity) {
    const labels = {
        'simples': 'Simples',
        'intermediaria': 'Intermediária',
        'complexa': 'Complexa',
        'especializada': 'Especializada'
    };
    return labels[complexity] || complexity;
}

function getUserLevelLabel(level) {
    const labels = {
        'iniciante': 'Iniciante',
        'intermediario': 'Intermediário',
        'avancado': 'Avançado',
        'especialista': 'Especialista'
    };
    return labels[level] || level;
}

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
        showManualCopyModal(text);
    }
}

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

function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText')?.value || '';
    const rating = currentRating;

    if (rating === 0) {
        showToast('⚠️ Por favor, selecione uma avaliação.', 'warning');
        return;
    }

    // Simular envio de feedback
    showToast(`✅ Feedback enviado! Avaliação: ${rating}/5 estrelas.\nObrigado por contribuir para melhorar o PromptForge!`, 'success');

    // Reset feedback
    const feedbackTextElement = document.getElementById('feedbackText');
    if (feedbackTextElement) {
        feedbackTextElement.value = '';
    }

    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    currentRating = 0;
}

function startOver() {
    // Reset all data
    formData = {};
    currentRating = 0;
    currentPhase = 1;
    appState = {
        currentPhase: 1,
        formData: {},
        validationResults: {},
        qualityMetrics: {
            clarityScore: 0,
            specificityScore: 0,
            completenessScore: 0,
            technicalAccuracy: 0,
            overallRating: 0
        }
    };

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
    const resultsSection = document.getElementById('resultsSection');
    const feedbackSection = document.getElementById('feedbackSection');

    if (resultsSection) resultsSection.classList.remove('show');
    if (feedbackSection) feedbackSection.classList.remove('show');

    // Start from phase 1
    const phase1 = document.getElementById('phase1');
    const phase1Step = document.querySelector('[data-phase="1"]');

    if (phase1 && phase1Step) {
        phase1.classList.add('active');
        phase1Step.classList.remove('pending');
        phase1Step.classList.add('active');
    }

    updateProgress();

    // Smooth scroll to top
    const mainCard = document.querySelector('.main-card');
    if (mainCard) {
        mainCard.scrollIntoView({ behavior: 'smooth' });
    }

    // Feedback visual
    showToast('🔄 Nova análise iniciada!', 'info');
}

// ========================================
// FUNÇÕES DE NAVEGAÇÃO SUAVE
// ========================================

function smoothScrollToTop() {
    const phaseIndicator = document.querySelector('.phase-indicator');
    if (phaseIndicator) {
        phaseIndicator.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========================================
// VALIDAÇÃO EM TEMPO REAL
// ========================================

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

function markRequiredFields() {
    // Fase 1
    const requestText = document.getElementById('requestText');
    const domain = document.getElementById('domain');
    const complexity = document.getElementById('complexity');
    const userLevel = document.getElementById('userLevel');

    if (requestText) requestText.setAttribute('required', 'required');
    if (domain) domain.setAttribute('required', 'required');
    if (complexity) complexity.setAttribute('required', 'required');
    if (userLevel) userLevel.setAttribute('required', 'required');

    // Fase 2
    const outputFormat = document.getElementById('outputFormat');
    const tone = document.getElementById('tone');
    const length = document.getElementById('length');

    if (outputFormat) outputFormat.setAttribute('required', 'required');
    if (tone) tone.setAttribute('required', 'required');
    if (length) length.setAttribute('required', 'required');

    // Fase 3
    const successCriteria = document.getElementById('successCriteria');
    if (successCriteria) successCriteria.setAttribute('required', 'required');
}

// ========================================
// EVENT LISTENERS
// ========================================

function addRatingListeners() {
    const ratingStars = document.getElementById('ratingStars');
    if (ratingStars) {
        ratingStars.addEventListener('click', (e) => {
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
}

// ========================================
// FUNÇÕES DE PERSISTÊNCIA
// ========================================

function saveToLocalStorage() {
    try {
        const stateData = {
            formData: appState.formData,
            currentPhase: appState.currentPhase,
            timestamp: Date.now()
        };
        localStorage.setItem('promptForgeState', JSON.stringify(stateData));
    } catch (error) {
        console.warn('Falha no salvamento local:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('promptForgeState');
        if (savedState) {
            const stateData = JSON.parse(savedState);
            appState = { ...appState, ...stateData };
            currentPhase = appState.currentPhase;
            formData = appState.formData;

            // Restaurar campos do formulário
            restoreFormFields();
            updateProgress();
        }
    } catch (error) {
        console.warn('Falha no carregamento local:', error);
    }
}

function restoreFormFields() {
    // Restaurar campos da Fase 1
    if (formData.requestText) {
        const requestText = document.getElementById('requestText');
        if (requestText) requestText.value = formData.requestText;
    }

    if (formData.domain) {
        const domain = document.getElementById('domain');
        if (domain) domain.value = formData.domain;
    }

    if (formData.complexity) {
        const complexity = document.getElementById('complexity');
        if (complexity) complexity.value = formData.complexity;
    }

    if (formData.userLevel) {
        const userLevel = document.getElementById('userLevel');
        if (userLevel) userLevel.value = formData.userLevel;
    }

    if (formData.context) {
        const context = document.getElementById('context');
        if (context) context.value = formData.context;
    }

    // Restaurar campos da Fase 2
    if (formData.outputFormat) {
        const outputFormat = document.getElementById('outputFormat');
        if (outputFormat) outputFormat.value = formData.outputFormat;
    }

    if (formData.tone) {
        const tone = document.getElementById('tone');
        if (tone) tone.value = formData.tone;
    }

    if (formData.length) {
        const length = document.getElementById('length');
        if (length) length.value = formData.length;
    }

    // Restaurar técnicas selecionadas
    if (formData.techniques) {
        formData.techniques.forEach(technique => {
            const checkbox = document.querySelector(`input[value="${technique}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Restaurar campos da Fase 3
    if (formData.successCriteria) {
        const successCriteria = document.getElementById('successCriteria');
        if (successCriteria) successCriteria.value = formData.successCriteria;
    }

    if (formData.restrictions) {
        const restrictions = document.getElementById('restrictions');
        if (restrictions) restrictions.value = formData.restrictions;
    }

    if (formData.examples) {
        const examples = document.getElementById('examples');
        if (examples) examples.value = formData.examples;
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Marcar campos obrigatórios
    markRequiredFields();

    // Adicionar validação em tempo real
    addRealTimeValidation();

    // Adicionar listeners para avaliação
    addRatingListeners();

    // Carregar estado salvo
    loadFromLocalStorage();

    // Inicializar progresso
    updateProgress();

    // Mostrar mensagem de boas-vindas
    showToast('🚀 PromptForge Pro carregado com sucesso!', 'success');
});

// ========================================
// EXPORTAÇÃO DE FUNÇÕES PARA HTML
// ========================================
// Todas as funções necessárias já estão definidas globalmente
