from rest_framework.views import exception_handler, Response
from rest_framework import status
from djongo.sql2mongo import SQLDecodeError

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    if isinstance(exc, SQLDecodeError) and response is None:
        response = Response(
            {
                'message': 'duplication error'
            },
            status=status.HTTP_400_BAD_REQUEST
            )
    elif response is not None:
        data = response.data
        response.data = {}
        errors = []
        for field, value in data.items():
            errors.append("{} : {}".format(field, " ".join(value)))

        response.data['errors'] = errors
        response.data['status'] = False

        response.data['exception'] = str(exc)

    return response
