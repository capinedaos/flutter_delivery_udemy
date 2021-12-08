import 'package:flutter_delivery_udemy/src/models/mercado_pago_credentials.dart';

class Environment {
  static const String API_DELIVERY = "192.168.1.72:3000";
  static const String API_KEY_MAPS = "TU_API_KEY";

  static MercadoPagoCredentials mercadoPagoCredentials = MercadoPagoCredentials(
      publicKey: 'TEST-a83f98c6-60da-4fe1-a800-f3087486345e',
      accessToken:
          'TEST-7920627250737983-120400-8c64cd91465fbcc1a55c8bc3165343b7-240977983');
}
