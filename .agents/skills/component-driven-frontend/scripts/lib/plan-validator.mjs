const requiredDesignIntentFields = ['product', 'audience', 'coreTask', 'visualDirection', 'density'];
const asyncStates = ['loading', 'empty', 'error', 'success'];
const interactiveImplyingCapabilities = new Set(['forms', 'controls', 'overlay']);
const dataImplyingCapabilities = new Set(['table', 'chart', 'metrics']);
const knownFoundations = new Set(['shadcn', 'heroui', 'mantine', 'mui', 'ant-design', 'chakra-ui']);
const knownEnhancers = new Set(['magicui', 'aceternity']);
const capabilityLibraries = new Set([
  'recharts',
  'tanstack-table',
  '@tanstack/react-table',
  '@tanstack/table-core',
  'lucide',
  'lucide-react',
  'motion',
  'framer-motion',
  'sonner',
]);
const identifierAliases = new Map([
  ['antd', 'ant-design'],
  ['material-ui', 'mui'],
  ['nextui', 'heroui'],
  ['magic-ui', 'magicui'],
  ['chakra', 'chakra-ui'],
]);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isNonEmptyStringArray = (value) => (
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
);

function issue(code, path, message) {
  return { code, path, message };
}

function normalizeIdentifier(value) {
  if (!isNonEmptyString(value)) return null;
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, '-');
  return identifierAliases.get(normalized) ?? normalized;
}

function normalizedSystem(value) {
  if (isNonEmptyString(value)) return normalizeIdentifier(value);
  if (Array.isArray(value) && value.length === 1 && isNonEmptyString(value[0])) {
    return normalizeIdentifier(value[0]);
  }
  return null;
}

function validateSystem(value, field, errors, { allowNull = false } = {}) {
  if (allowNull && value === null) return;
  if (isNonEmptyString(value)) return;
  if (Array.isArray(value) && value.length === 1 && isNonEmptyString(value[0])) return;

  errors.push(issue(
    Array.isArray(value) && value.length > 1 ? `multiple-${field}s` : `invalid-${field}`,
    `/${field}`,
    `${field} must be ${allowNull ? 'null, ' : ''}a string, or a single-element array.`,
  ));
}

function validateSelectionSource(source, path, foundation, enhancer, errors) {
  const normalizedSource = normalizeIdentifier(source);
  if (!normalizedSource) return;

  if (knownFoundations.has(normalizedSource) && foundation && normalizedSource !== foundation) {
    errors.push(issue(
      'foundation-source-conflict',
      `${path}/selection/source`,
      `Selection source ${source} conflicts with declared foundation ${foundation}.`,
    ));
  }

  const selectsEnhancerAlias = normalizedSource === 'enhancer';
  const selectsKnownEnhancer = knownEnhancers.has(normalizedSource);
  if ((selectsEnhancerAlias && !enhancer) || (selectsKnownEnhancer && normalizedSource !== enhancer)) {
    errors.push(issue(
      'enhancer-source-conflict',
      `${path}/selection/source`,
      `Selection source ${source} is not the declared enhancer${enhancer ? ` ${enhancer}` : ''}.`,
    ));
  }
}

export function validateComponentPlan(plan) {
  const errors = [];
  const warnings = [];
  const document = isRecord(plan) ? plan : {};

  if (document.version !== 1) {
    errors.push(issue('invalid-version', '/version', 'version must equal 1.'));
  }

  if (!isRecord(document.designIntent)) {
    errors.push(issue('invalid-design-intent', '/designIntent', 'designIntent must be an object.'));
  } else {
    for (const field of requiredDesignIntentFields) {
      if (!isNonEmptyString(document.designIntent[field])) {
        errors.push(issue('design-intent-field-required', `/designIntent/${field}`, `designIntent.${field} is required.`));
      }
    }
    if (!isNonEmptyStringArray(document.designIntent.principles)) {
      errors.push(issue(
        'design-intent-field-required',
        '/designIntent/principles',
        'designIntent.principles must be a non-empty array of non-empty strings.',
      ));
    }
  }

  validateSystem(document.foundation, 'foundation', errors);
  validateSystem(document.enhancer, 'enhancer', errors, { allowNull: true });
  const foundation = normalizedSystem(document.foundation);
  const enhancer = normalizedSystem(document.enhancer);
  if (enhancer && capabilityLibraries.has(enhancer)) {
    errors.push(issue(
      'capability-library-as-enhancer',
      '/enhancer',
      `${document.enhancer} is a capability library; list it in dependencies, not enhancer.`,
    ));
  }

  if (!Array.isArray(document.dependencies)) {
    errors.push(issue('invalid-dependencies', '/dependencies', 'dependencies must be an array.'));
  } else {
    document.dependencies.forEach((dependency, index) => {
      const dependencyPath = `/dependencies/${index}`;
      if (!isRecord(dependency)) {
        errors.push(issue('invalid-dependency', dependencyPath, 'Each dependency must be an object.'));
        return;
      }
      for (const field of ['name', 'reason']) {
        if (!isNonEmptyString(dependency[field])) {
          errors.push(issue('dependency-field-required', `${dependencyPath}/${field}`, `dependency.${field} is required.`));
        }
      }
      if (typeof dependency.new !== 'boolean') {
        errors.push(issue('dependency-new-required', `${dependencyPath}/new`, 'dependency.new must be a boolean.'));
      }
    });
  }

  if (!Array.isArray(document.regions)) {
    errors.push(issue('invalid-regions', '/regions', 'regions must be an array.'));
  } else {
    document.regions.forEach((region, index) => {
      const regionPath = `/regions/${index}`;
      if (!isRecord(region)) {
        errors.push(issue('invalid-region', regionPath, 'Each region must be an object.'));
        return;
      }

      for (const field of ['id', 'need', 'reason', 'responsive']) {
        if (!isNonEmptyString(region[field])) {
          errors.push(issue('region-field-required', `${regionPath}/${field}`, `region.${field} is required.`));
        }
      }

      const capabilitiesValid = isNonEmptyStringArray(region.capabilities);
      const statesValid = isNonEmptyStringArray(region.states);
      const selectionValid = isRecord(region.selection);
      const accessibilityValid = isRecord(region.accessibility);

      if (!capabilitiesValid) {
        errors.push(issue(
          'invalid-region-capabilities',
          `${regionPath}/capabilities`,
          'region.capabilities must be a non-empty array of non-empty strings.',
        ));
      }
      if (!statesValid) {
        errors.push(issue(
          'invalid-region-states',
          `${regionPath}/states`,
          'region.states must be a non-empty array of non-empty strings.',
        ));
      }
      if (!selectionValid) {
        errors.push(issue('invalid-region-selection', `${regionPath}/selection`, 'region.selection must be an object.'));
      }
      if (!accessibilityValid) {
        errors.push(issue('invalid-region-accessibility', `${regionPath}/accessibility`, 'region.accessibility must be an object.'));
      }

      const selection = selectionValid ? region.selection : {};
      const accessibility = accessibilityValid ? region.accessibility : {};
      const capabilities = capabilitiesValid ? region.capabilities : [];
      const states = statesValid ? region.states : [];

      if (!isNonEmptyString(selection.source)) {
        errors.push(issue('selection-source-required', `${regionPath}/selection/source`, 'selection.source must be a non-empty string.'));
      } else {
        validateSelectionSource(selection.source, regionPath, foundation, enhancer, errors);
      }
      if (!isNonEmptyString(selection.component)) {
        errors.push(issue('selection-component-required', `${regionPath}/selection/component`, 'selection.component must be a non-empty string.'));
      }

      if (normalizeIdentifier(selection.source) === 'custom') {
        if (!isNonEmptyString(region.customReason)) {
          errors.push(issue('custom-reason-required', `${regionPath}/customReason`, 'Custom selections require customReason.'));
        }
        if (!isNonEmptyStringArray(region.rejectedCandidates)) {
          errors.push(issue(
            'rejected-candidates-required',
            `${regionPath}/rejectedCandidates`,
            'Custom selections require a non-empty rejectedCandidates string array.',
          ));
        }
      }

      const interactiveImplications = capabilities.filter((capability) => (
        interactiveImplyingCapabilities.has(capability)
      ));
      if (interactiveImplications.length > 0 && !capabilities.includes('interactive')) {
        errors.push(issue(
          'interactive-capability-required',
          `${regionPath}/capabilities`,
          `${interactiveImplications.join(', ')} capabilities require the interactive capability.`,
        ));
      }

      const dataImplications = capabilities.filter((capability) => dataImplyingCapabilities.has(capability));
      if (dataImplications.length > 0 && !capabilities.includes('data')) {
        errors.push(issue(
          'data-capability-required',
          `${regionPath}/capabilities`,
          `${dataImplications.join(', ')} capabilities require the data capability.`,
        ));
      }

      if (capabilities.includes('interactive')) {
        for (const field of ['keyboard', 'focus', 'semantics']) {
          if (!isNonEmptyString(accessibility[field])) {
            errors.push(issue(
              'interactive-accessibility-required',
              `${regionPath}/accessibility/${field}`,
              `Interactive regions require accessibility.${field}.`,
            ));
          }
        }
      }

      if (statesValid && (capabilities.includes('data') || capabilities.includes('async'))) {
        const missing = asyncStates.filter((state) => !states.includes(state));
        if (missing.length) {
          warnings.push(issue(
            'async-states-incomplete',
            `${regionPath}/states`,
            `Data or async regions should include loading, empty, error, and success states; missing: ${missing.join(', ')}.`,
          ));
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      regionCount: Array.isArray(document.regions) ? document.regions.length : 0,
      errorCount: errors.length,
      warningCount: warnings.length,
    },
  };
}
