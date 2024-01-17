"""empty message

Revision ID: cf0796409da2
Revises: bf4e80c099a4
Create Date: 2024-01-17 18:37:14.237460

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cf0796409da2'
down_revision = 'bf4e80c099a4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Ofertas', schema=None) as batch_op:
        batch_op.alter_column('FechaOferta',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Ofertas', schema=None) as batch_op:
        batch_op.alter_column('FechaOferta',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)

    # ### end Alembic commands ###