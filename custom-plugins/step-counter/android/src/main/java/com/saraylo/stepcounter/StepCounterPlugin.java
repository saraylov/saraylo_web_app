package com.saraylo.stepcounter;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.PermissionState;

@CapacitorPlugin(
    name = "StepCounter",
    permissions = {
        @Permission(
            strings = { Manifest.permission.ACTIVITY_RECOGNITION },
            alias = "activityRecognition"
        )
    }
)
public class StepCounterPlugin extends Plugin implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor stepSensor;
    private int stepCount = 0;
    private boolean isTracking = false;

    @Override
    public void load() {
        super.load();
        sensorManager = (SensorManager) getActivity().getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        }
    }

    @PluginMethod
    public void getStepCount(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("steps", stepCount);
        call.resolve(ret);
    }

    @PluginMethod
    public void startTracking(PluginCall call) {
        if (stepSensor == null) {
            call.reject("Step counter sensor not available");
            return;
        }

        // Проверяем разрешения для Android 10 и выше
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (getPermissionState("activityRecognition") != PermissionState.GRANTED) {
                requestPermissionForAlias("activityRecognition", call, "activityRecognitionPermissionCallback");
                return;
            }
        }

        if (!isTracking) {
            sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
            isTracking = true;
        }
        call.resolve();
    }

    @PluginMethod
    public void stopTracking(PluginCall call) {
        if (isTracking) {
            sensorManager.unregisterListener(this);
            isTracking = false;
        }
        call.resolve();
    }

    @PermissionCallback
    private void activityRecognitionPermissionCallback(PluginCall call) {
        if (getPermissionState("activityRecognition") == PermissionState.GRANTED) {
            if (!isTracking) {
                sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
                isTracking = true;
            }
            call.resolve();
        } else {
            call.reject("Permission for activity recognition is required to count steps");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            stepCount = (int) event.values[0];
            
            // Отправляем обновление в JavaScript
            JSObject ret = new JSObject();
            ret.put("steps", stepCount);
            notifyListeners("stepCountUpdate", ret);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Не используется
    }

    @Override
    protected void handleOnDestroy() {
        if (isTracking) {
            sensorManager.unregisterListener(this);
            isTracking = false;
        }
        super.handleOnDestroy();
    }
}