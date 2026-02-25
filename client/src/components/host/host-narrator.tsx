import { HostProvider } from './host-provider';
import HostDock from './host-dock';
import HostPanel from './host-panel';
import ExperienceOverlay from './experience-overlay';
import SectionObserverBridge from './section-observer-bridge';

export default function HostNarrator() {
  return (
    <HostProvider>
      <SectionObserverBridge />
      <HostDock />
      <HostPanel />
      <ExperienceOverlay />
    </HostProvider>
  );
}
