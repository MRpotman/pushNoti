import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonTextarea,
  IonInput,
  IonLabel,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { notifications, people, layers } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [tab, setTab] = useState<'single' | 'topic' | 'multiple'>('single');
  const [firebaseCreds, setFirebaseCreds] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [topicName, setTopicName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dataJson, setDataJson] = useState('');
  const [multicastTokens, setMulticastTokens] = useState('');
  const [response, setResponse] = useState('');

  const apiBase = 'http://10.0.2.2:3000/api';


  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => {
    getTokens();
  }, []);
  
  const getTokens = async () => {
    try {
      const res = await fetch(`${apiBase}/get-tokens`);
      const result = await res.json();
      if (result.success) {
        setTokens(result.tokens); // Se espera que el backend devuelva { success: true, tokens: [ ... ] }
      } else {
        setResponse('Error al obtener los tokens');
      }
    } catch (error: any) {
      setResponse('Error al obtener los tokens: ' + error.message);
    }
  };

  const configureFirebase = async () => {
    try {
      const credentials = JSON.parse(firebaseCreds);
      const res = await fetch(`${apiBase}/configure-firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentials }),
      });
      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse('Error al configurar Firebase: ' + error.message);
    }
  };

  const sendSingleNotification = async () => {
    try {
      const data = dataJson ? JSON.parse(dataJson) : {};
      const res = await fetch(`${apiBase}/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: deviceToken, title, body, data }),
      });
      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse('Error al enviar notificación: ' + error.message);
    }
  };

  const sendTopicNotification = async () => {
    try {
      const data = dataJson ? JSON.parse(dataJson) : {};
      const res = await fetch(`${apiBase}/send-topic-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicName, title, body, data }),
      });
      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse('Error al enviar al tema: ' + error.message);
    }
  };

  const sendMulticastNotification = async () => {
    try {
      const data = dataJson ? JSON.parse(dataJson) : {};
      const tokens = multicastTokens.split('\n').map((t) => t.trim()).filter(Boolean);
      const res = await fetch(`${apiBase}/send-multicast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, title, body, data }),
      });
      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse('Error al enviar multicast: ' + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Firebase Push Notification Tester</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonText color="medium">
          <p>Envía notificaciones push de prueba a dispositivos registrados en Firebase</p>
        </IonText>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Configuración de Firebase</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Credenciales Firebase (serviceAccountKey.json)</IonLabel>
              <IonTextarea
                placeholder="Pega aquí el contenido JSON completo"
                rows={6}
                value={firebaseCreds}
                onIonChange={(e) => setFirebaseCreds(e.detail.value!)}
              />
            </IonItem>
            <IonButton expand="block" className="ion-margin-top" onClick={configureFirebase}>
              Configurar Firebase
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonSegment value={tab} onIonChange={(e) => setTab(e.detail.value as any)}>
          <IonSegmentButton value="single">
            <IonIcon icon={notifications} />
            <IonLabel>Dispositivo Único</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="topic">
            <IonIcon icon={people} />
            <IonLabel>Tema</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="multiple">
            <IonIcon icon={layers} />
            <IonLabel>Múltiples</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {tab === 'single' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Dispositivo Único</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Token del Dispositivo</IonLabel>
                <IonTextarea
                  required
                  value={deviceToken}
                  placeholder="Ingresa el token FCM del dispositivo"
                  onIonChange={(e) => setDeviceToken(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  required
                  value={title}
                  placeholder="Título de la notificación"
                  onIonChange={(e) => setTitle(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Mensaje</IonLabel>
                <IonTextarea
                  required
                  value={body}
                  placeholder="Cuerpo del mensaje"
                  onIonChange={(e) => setBody(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datos adicionales (JSON - opcional)</IonLabel>
                <IonTextarea
                  placeholder='{"key1": "value1"}'
                  value={dataJson}
                  onIonChange={(e) => setDataJson(e.detail.value!)}
                />
              </IonItem>
              <IonButton expand="block" className="ion-margin-top" onClick={sendSingleNotification}>
                Enviar Notificación
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {tab === 'topic' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Enviar a Tema</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Nombre del Tema</IonLabel>
                <IonInput
                  required
                  value={topicName}
                  placeholder="ej: noticias"
                  onIonChange={(e) => setTopicName(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  required
                  value={title}
                  placeholder="Título de la notificación"
                  onIonChange={(e) => setTitle(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Mensaje</IonLabel>
                <IonTextarea
                  required
                  value={body}
                  placeholder="Cuerpo del mensaje"
                  onIonChange={(e) => setBody(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datos adicionales (JSON - opcional)</IonLabel>
                <IonTextarea
                  placeholder='{"key1": "value1"}'
                  value={dataJson}
                  onIonChange={(e) => setDataJson(e.detail.value!)}
                />
              </IonItem>
              <IonButton expand="block" className="ion-margin-top" onClick={sendTopicNotification}>
                Enviar Notificación al Tema
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {tab === 'multiple' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Múltiples Dispositivos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Tokens (uno por línea)</IonLabel>
                <IonTextarea
                  required
                  value={multicastTokens}
                  placeholder="Ingresa los tokens FCM separados por línea"
                  onIonChange={(e) => setMulticastTokens(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  required
                  value={title}
                  placeholder="Título de la notificación"
                  onIonChange={(e) => setTitle(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Mensaje</IonLabel>
                <IonTextarea
                  required
                  value={body}
                  placeholder="Cuerpo del mensaje"
                  onIonChange={(e) => setBody(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datos adicionales (JSON - opcional)</IonLabel>
                <IonTextarea
                  placeholder='{"key1": "value1"}'
                  value={dataJson}
                  onIonChange={(e) => setDataJson(e.detail.value!)}
                />
              </IonItem>
              <IonButton expand="block" className="ion-margin-top" onClick={sendMulticastNotification}>
                Enviar Notificaciones
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Respuesta</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <pre id="response">{response}</pre>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Historial de Envíos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent id="history">{/* Aquí el historial */}</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
