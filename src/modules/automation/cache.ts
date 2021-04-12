import { AtomCache } from '../../generic/supply/atom-cache';
import { Atom } from '@grammarly/focal';
import { createFig } from '../../generic/supply/atom-helpers';
import { defer } from 'rxjs';
import { tachka } from '../shell/tachkaClient';
import { IAutomationDefinition } from '../api-tachka/types/automation';

const defaultValue: Record<string, IAutomationDefinition> = {};

export const cacheDefinitions$ = new AtomCache({
  fig$: Atom.create(createFig()),
  value$: Atom.create(defaultValue),
  shouldLoad: (value) => value === defaultValue,
  getValue$: defer(() => tachka.automationInstanceDefinitions()),
});
