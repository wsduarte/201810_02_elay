/*
 * The MIT License
 *
 * Copyright 2018 ws.duarte.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package healthcheck;

import java.util.List;
import java.util.ArrayList;

/**
 *
 * @author ws.duarte
 */
public class ManejadorHealthCheck {
    
    private static final int time = 10000, max = 5;
    private static List<ReporteCerradura> reportes = new ArrayList<>();
    
    public static void iniciarMedicion(String id) {
        ReporteCerradura repor = new ReporteCerradura(id);
        reportes.add(repor);
        new Thread(new Verificador(time, max, repor, new NotificarCerradura(id), id)).start();
    }
    
    public static void reportar(String id) {
        ReporteCerradura reporte = reportes.stream().filter(r -> r.getId().equals(id)).findFirst().orElse(null);
        if(reporte != null) reporte.reportar();
    }
    
    public static void eliminar(String id) {
        reportes.removeIf(r -> r.getId().equals(id));
    }
    
}
