import { Server } from 'socket.io';

// Fonction helper pour émettre des événements temps réel
export function createRealtimeEmitter(io: Server) {
  return {
    // Organisations
    organisationCreated: (data: any) => {
      io.emit('organisation:created', data);
      console.log('📡 Événement émis: organisation:created');
    },
    organisationUpdated: (data: any) => {
      io.emit('organisation:updated', data);
      console.log('📡 Événement émis: organisation:updated');
    },
    organisationDeleted: (id: string) => {
      io.emit('organisation:deleted', { id });
      console.log('📡 Événement émis: organisation:deleted');
    },

    // Sections
    sectionCreated: (data: any) => {
      io.emit('section:created', data);
      console.log('📡 Événement émis: section:created');
    },
    sectionUpdated: (data: any) => {
      io.emit('section:updated', data);
      console.log('📡 Événement émis: section:updated');
    },
    sectionDeleted: (id: string) => {
      io.emit('section:deleted', { id });
      console.log('📡 Événement émis: section:deleted');
    },

    // Villages
    villageCreated: (data: any) => {
      io.emit('village:created', data);
      console.log('📡 Événement émis: village:created');
    },
    villageUpdated: (data: any) => {
      io.emit('village:updated', data);
      console.log('📡 Événement émis: village:updated');
    },
    villageDeleted: (id: string) => {
      io.emit('village:deleted', { id });
      console.log('📡 Événement émis: village:deleted');
    },

    // Producteurs
    producteurCreated: (data: any) => {
      io.emit('producteur:created', data);
      console.log('📡 Événement émis: producteur:created');
    },
    producteurUpdated: (data: any) => {
      io.emit('producteur:updated', data);
      console.log('📡 Événement émis: producteur:updated');
    },
    producteurDeleted: (id: string) => {
      io.emit('producteur:deleted', { id });
      console.log('📡 Événement émis: producteur:deleted');
    },

    // Parcelles
    parcelleCreated: (data: any) => {
      io.emit('parcelle:created', data);
      console.log('📡 Événement émis: parcelle:created');
    },
    parcelleUpdated: (data: any) => {
      io.emit('parcelle:updated', data);
      console.log('📡 Événement émis: parcelle:updated');
    },
    parcelleDeleted: (id: string) => {
      io.emit('parcelle:deleted', { id });
      console.log('📡 Événement émis: parcelle:deleted');
    },

    // Opérations
    operationCreated: (data: any) => {
      io.emit('operation:created', data);
      console.log('📡 Événement émis: operation:created');
    },
    operationUpdated: (data: any) => {
      io.emit('operation:updated', data);
      console.log('📡 Événement émis: operation:updated');
    },
    operationDeleted: (id: string) => {
      io.emit('operation:deleted', { id });
      console.log('📡 Événement émis: operation:deleted');
    },

    // Agents
    agentCreated: (data: any) => {
      io.emit('agent:created', data);
      console.log('📡 Événement émis: agent:created');
    },
    agentUpdated: (data: any) => {
      io.emit('agent:updated', data);
      console.log('📡 Événement émis: agent:updated');
    },
    agentDeleted: (id: string) => {
      io.emit('agent:deleted', { id });
      console.log('📡 Événement émis: agent:deleted');
    },

    // Régions
    regionCreated: (data: any) => {
      io.emit('region:created', data);
      console.log('📡 Événement émis: region:created');
    },
    regionUpdated: (data: any) => {
      io.emit('region:updated', data);
      console.log('📡 Événement émis: region:updated');
    },
    regionDeleted: (id: string) => {
      io.emit('region:deleted', { id });
      console.log('📡 Événement émis: region:deleted');
    },
  };
}

export type RealtimeEmitter = ReturnType<typeof createRealtimeEmitter>;
